import { Redis } from '@upstash/redis';
import { getUser, isAdminEmail } from './db';

// Fallback for development if env vars are missing
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? Redis.fromEnv()
    : null;

export async function checkRateLimit(
    clerkUserId: string | null,
    email: string | null,
    ip: string
): Promise<{
    allowed: boolean;
    remaining: number;
    limit: number;
    resetAt?: Date;
}> {
    // Check if admin
    if (email && await isAdminEmail(email)) {
        return {
            allowed: true,
            remaining: Infinity,
            limit: Infinity
        };
    }

    // Authenticated user
    if (clerkUserId) {
        try {
            const user = await getUser(clerkUserId);

            // If user signed in but not in our DB yet, they have free tier (1 analysis)
            if (!user) {
                return await checkFreeTierIPLimit(ip);
            }

            const limit = user.analyses_limit;
            const used = user.analyses_used;
            const remaining = Math.max(0, limit - used);

            return {
                allowed: remaining > 0,
                remaining,
                limit,
                resetAt: new Date(user.period_end)
            };
        } catch (error) {
            console.error('Error checking user rate limit:', error);
            // Fallback to IP limit on DB error
            return await checkFreeTierIPLimit(ip);
        }
    }

    // Free tier (unauthenticated) - 1 per IP per day
    return await checkFreeTierIPLimit(ip);
}

async function checkFreeTierIPLimit(ip: string) {
    if (!redis) {
        console.warn('Upstash Redis not configured. Rate limiting disabled for free tier.');
        return { allowed: true, remaining: 1, limit: 1 };
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `free:${ip}:${today}`;

    try {
        const count = await redis.incr(key);
        if (count === 1) {
            await redis.expire(key, 86400); // 24 hours
        }

        return {
            allowed: count <= 1,
            remaining: Math.max(0, 1 - count),
            limit: 1,
            resetAt: new Date(new Date().setHours(24, 0, 0, 0))
        };
    } catch (error) {
        console.error('Redis error:', error);
        return { allowed: true, remaining: 0, limit: 1 };
    }
}
