import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUser } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({
                authenticated: false,
                tier: 'free',
                analyses_used: 0,
                analyses_limit: 1
            });
        }

        const user = await getUser(userId);

        if (!user) {
            return NextResponse.json({
                authenticated: true,
                tier: 'free',
                analyses_used: 0,
                analyses_limit: 1
            });
        }

        return NextResponse.json({
            authenticated: true,
            tier: user.tier,
            analyses_used: user.analyses_used,
            analyses_limit: user.analyses_limit,
            nextReset: user.period_end
        });

    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json(
            { error: 'Failed to check subscription' },
            { status: 500 }
        );
    }
}
