'use client';

interface PricingCardProps {
    tier: 'free' | 'pro';
    price: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    onSubscribe: () => void;
    isLoading?: boolean;
}

export function PricingCard({
    tier,
    price,
    features,
    isPopular,
    buttonText,
    onSubscribe,
    isLoading
}: PricingCardProps) {
    return (
        <div className={`relative flex flex-col p-6 rounded-2xl border ${isPopular
                ? 'bg-green-950/20 border-green-500 shadow-lg shadow-green-500/10'
                : 'bg-zinc-900/50 border-zinc-800'
            }`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-full">
                    POPULAR
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{tier}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    <span className="text-zinc-400">/month</span>
                </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                        <span className="text-green-500">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={onSubscribe}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-bold transition-all ${isPopular
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isLoading ? 'Processing...' : buttonText}
            </button>
        </div>
    );
}
