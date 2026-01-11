import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = user.emailAddresses[0].emailAddress;
        const origin = req.headers.get('origin') || 'https://osint-vision.vercel.app';

        // Direct fetch to Stripe API to avoid SDK versioning issues
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'customer_email': email,
                'mode': 'subscription',
                'success_url': `${origin}/analyze?success=true`,
                'cancel_url': `${origin}/analyze?canceled=true`,
                'line_items[0][price]': STRIPE_PRICE_ID,
                'line_items[0][quantity]': '1',
                'metadata[clerkUserId]': userId,
            }).toString(),
        });

        const session = await response.json();

        if (!response.ok) {
            console.error('Stripe API error:', session);
            return NextResponse.json(
                { error: session.error?.message || 'Stripe API error' },
                { status: response.status }
            );
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
