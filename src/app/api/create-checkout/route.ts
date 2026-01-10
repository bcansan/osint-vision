import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-preview' as any,
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = user.emailAddresses[0].emailAddress;
        const origin = req.headers.get('origin') || 'https://osint-vision.vercel.app';

        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/analyze?success=true`,
            cancel_url: `${origin}/analyze?canceled=true`,
            metadata: {
                clerkUserId: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
