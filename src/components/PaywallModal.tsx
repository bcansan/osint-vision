'use client';

import { useState } from 'react';
import { PricingCard } from './PricingCard';

interface PaywallModalProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function PaywallModal({ show, onClose, title, description }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!show) return null;

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/create-checkout', { method: 'POST' });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Error starting checkout: ' + (data.error || 'Unknown error'));
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to connect to checkout service');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        {title || 'GO PRO FOR UNLIMITED ANALYTICS'}
                    </h2>
                    <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
                        {description || 'Free tier limit reached. Upgrade to Pro to analyze more images and download specialized intelligence reports.'}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <PricingCard
                            tier="free"
                            price="$0"
                            features={[
                                '1 Intelligence analysis / month',
                                'Basic image verification',
                                'Community access',
                                'Web view only'
                            ]}
                            buttonText="Current Plan"
                            onSubscribe={() => { }}
                            isLoading={false}
                        />

                        <PricingCard
                            tier="pro"
                            price="$19"
                            features={[
                                '100 Intelligence analyses / month',
                                'Google Lens integration active',
                                'Full EXIF extraction & analysis',
                                'Downloadable PDF & JSON reports',
                                'Priority processing'
                            ]}
                            isPopular={true}
                            buttonText="Upgrade Now"
                            onSubscribe={handleSubscribe}
                            isLoading={isLoading}
                        />
                    </div>

                    <p className="mt-8 text-xs text-zinc-600">
                        Secure payment via Stripe. Cancel anytime. Terms of service apply.
                    </p>
                </div>
            </div>
        </div>
    );
}
