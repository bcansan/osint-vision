import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { updateUserTier, getUser } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-preview' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;

        if (clerkUserId) {
            // Update user to Pro in Supabase
            // First get our internal UUID for this user if needed or use the updateUserTier which takes it
            // updateUserTier in db.ts actually expects the internal UUID, so we need to find it by clerk_id
            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('clerk_id', clerkUserId)
                .single();

            if (userData) {
                await updateUserTier(userData.id, 'pro', 100);
                console.log(`✅ User ${clerkUserId} upgraded to PRO`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
