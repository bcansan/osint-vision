'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false);

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
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/analyze" className="flex items-center gap-3 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">OSINT VISION</h1>
                            <p className="text-[10px] text-green-500 font-mono tracking-widest uppercase">Intelligence Platform</p>
                        </div>
                    </Link>

                    <Link href="/analyze" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                            UPGRADE YOUR <br />INTELLIGENCE
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Unlock professional-grade OSINT tools. Precise identification, high-volume analysis, and industrial report generation.
                        </p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                        <PricingCard
                            tier="free"
                            price="$0"
                            features={[
                                '1 Intelligence analysis / month',
                                'Basic image verification',
                                'Community access',
                                'Web view only',
                                'No EXIF extraction support',
                                'Low priority processing'
                            ]}
                            buttonText="Current Plan"
                            onSubscribe={() => { }}
                            isLoading={false}
                        />

                        <PricingCard
                            tier="pro"
                            price="$9.99"
                            features={[
                                '100 Intelligence analyses / month',
                                'Google Lens integration active',
                                'GPT-4o Identification backup',
                                'Full EXIF extraction & analysis',
                                'Downloadable PDF & JSON reports',
                                'Priority processing (Super-fast)',
                                '30-day analysis history'
                            ]}
                            isPopular={true}
                            buttonText="Upgrade to Pro"
                            onSubscribe={handleSubscribe}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Feature Comparison Table */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-8 text-center">Detailed Comparison</h3>
                        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="p-6 text-left font-bold text-zinc-400">Feature</th>
                                        <th className="p-6 text-center font-bold text-zinc-400">Free</th>
                                        <th className="p-6 text-center font-bold text-green-500">Pro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">Monthly Analyses</td>
                                        <td className="p-6 text-center text-zinc-500">1</td>
                                        <td className="p-6 text-center text-white font-bold">100</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">Analysis Modes</td>
                                        <td className="p-6 text-center text-zinc-500">Limited</td>
                                        <td className="p-6 text-center text-white font-bold">All (4 Modes)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">Google Lens Integration</td>
                                        <td className="p-6 text-center text-zinc-500">No</td>
                                        <td className="p-6 text-center text-green-500 font-bold">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">EXIF Data Extraction</td>
                                        <td className="p-6 text-center text-zinc-500">No</td>
                                        <td className="p-6 text-center text-green-500 font-bold">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">Report Exports (PDF/JSON)</td>
                                        <td className="p-6 text-center text-zinc-500">No</td>
                                        <td className="p-6 text-center text-green-500 font-bold">Unlimited</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-zinc-300 font-medium">History Tracking</td>
                                        <td className="p-6 text-center text-zinc-500">None</td>
                                        <td className="p-6 text-center text-white">30 Days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-zinc-900 text-center">
                <p className="text-zinc-500 text-sm">
                    © 2026 OSINT VISION Intelligence Platform. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-xs text-zinc-600 uppercase tracking-widest">
                    <button className="hover:text-zinc-400 transition-colors">Privacy Policy</button>
                    <button className="hover:text-zinc-400 transition-colors">Terms of Service</button>
                    <span className="text-zinc-800">|</span>
                    <span className="text-zinc-700">Built for security experts</span>
                </div>
            </footer>
        </div>
    );
}
