'use client';

import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RateLimitModalProps {
    show: boolean;
    onClose: () => void;
    userType: 'anonymous' | 'free' | 'pro';
    resetDate?: string;
    limit?: number;
}

export function RateLimitModal({ show, onClose, userType, resetDate, limit }: RateLimitModalProps) {
    const { openSignUp } = useClerk();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!show) return null;

    const handleUpgrade = async () => {
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

    const isAnonymous = userType === 'anonymous';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
                >
                    ✕
                </button>

                <div className="p-8 md:p-10 text-center relative z-10">
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <span className="text-4xl">{isAnonymous ? '🎉' : '📊'}</span>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        {isAnonymous ? 'FREE TRIAL EXHAUSTED!' : 'MONTHLY LIMIT REACHED'}
                    </h2>

                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                        {isAnonymous
                            ? "You've successfully used your guest analysis. Sign up now to unlock full intelligence capabilities."
                            : `You've used your ${limit || 1} free monthly analysis. Upgrade to Pro for high-volume operations.`
                        }
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="grid grid-cols-1 gap-3 text-left">
                            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                                <span className="text-green-500">✓</span>
                                <span className="text-sm text-zinc-300">
                                    {isAnonymous ? '1 Free monthly analysis (Authenticated)' : '100 Intelligence analyses / month'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                                <span className="text-green-500">✓</span>
                                <span className="text-sm text-zinc-300">
                                    {isAnonymous ? 'Access to all 4 analysis modes' : 'Google Lens integration active'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                                <span className="text-green-500">✓</span>
                                <span className="text-sm text-zinc-300">
                                    {isAnonymous ? 'Metadata extraction enabled' : 'Unlimited PDF & JSON report exports'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {isAnonymous ? (
                            <button
                                onClick={() => openSignUp()}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-95"
                            >
                                Sign Up Free
                            </button>
                        ) : null}

                        <button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className={`w-full py-4 ${isAnonymous ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-green-600 hover:bg-green-500'} text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50`}
                        >
                            {isLoading ? 'Processing...' : 'Upgrade to Pro - $9.99/mo'}
                        </button>

                        <button
                            onClick={() => router.push('/upgrade')}
                            className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors mt-2"
                        >
                            Compare Plans & Features
                        </button>
                    </div>

                    {resetDate && !isAnonymous && (
                        <p className="mt-8 text-xs text-zinc-600 font-mono uppercase tracking-widest">
                            Free limit resets on: {new Date(resetDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
