'use client';

import { useState, useEffect } from 'react';

export function EthicalDisclaimer() {
    const [show, setShow] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('osint-vision-disclaimer-accepted');
        if (!hasAccepted) {
            setShow(true);
        } else {
            setAccepted(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('osint-vision-disclaimer-accepted', 'true');
        setAccepted(true);
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-red-500/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">⚖️</div>
                    <h2 className="text-2xl font-bold text-red-500">ETHICAL USE ONLY</h2>
                    <p className="text-gray-400">Please read and accept the terms before using OSINT Vision</p>
                </div>

                <div className="space-y-4 mb-6 text-sm text-gray-300">
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-green-400 mb-2">✅ AUTHORIZED USES:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Cybersecurity research and threat intelligence</li>
                            <li>Authorized penetration testing and security audits</li>
                            <li>Law enforcement with proper legal authority</li>
                            <li>Journalism and fact-checking investigations</li>
                            <li>Academic research and education</li>
                            <li>Open Source Intelligence (OSINT) investigations</li>
                        </ul>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-red-400 mb-2">❌ PROHIBITED USES:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Stalking, harassment, or intimidation of individuals</li>
                            <li>Unauthorized surveillance or privacy violations</li>
                            <li>Discrimination based on protected characteristics</li>
                            <li>Identity theft or impersonation</li>
                            <li>Any illegal activity or criminal purposes</li>
                            <li>Violation of GDPR, LOPD or local privacy laws</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-400 mb-2">⚠️ USER RESPONSIBILITIES:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Respect individuals' privacy rights at all times</li>
                            <li>Obtain proper authorization before investigations</li>
                            <li>Handle sensitive data responsibly and securely</li>
                            <li>Do not store or share personal data without consent</li>
                            <li>Use findings ethically and responsibly</li>
                        </ul>
                    </div>

                    <div className="text-xs text-gray-500 mt-4 italic">
                        <p>
                            Legal Disclaimer: The creators and operators of OSINT Vision assume NO LIABILITY
                            for any misuse of this tool. Users are solely responsible for their actions and must ensure
                            compliance with Spanish Penal Code (Article 197), GDPR, LOPD, and all applicable international
                            laws. This tool is provided AS-IS for legitimate security research purposes only.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-start gap-3 mb-6">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <label htmlFor="accept-terms" className="text-sm text-gray-400 select-none cursor-pointer">
                            I have read and understand the ethical guidelines. I agree to use OSINT Vision
                            exclusively for legitimate, authorized purposes and in compliance with all
                            applicable laws.
                        </label>
                    </div>

                    <button
                        onClick={handleAccept}
                        disabled={!accepted}
                        className={`
              w-full py-3 rounded-lg font-bold transition-all
              ${accepted
                                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
            `}
                    >
                        {accepted ? 'Accept & Continue →' : 'Please read and accept the terms'}
                    </button>
                </div>
            </div>
        </div>
    );
}
