'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ModeSelector } from '@/components/ModeSelector';
import { ImageUploader } from '@/components/ImageUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { ExifDisplay } from '@/components/ExifDisplay';
import { ExportButtons } from '@/components/ExportButtons';
import { EthicalDisclaimer } from '@/components/EthicalDisclaimer';
import { AnalysisMode, AnalysisResult, ExifData } from '@/lib/types';
import { RateLimitModal } from '@/components/RateLimitModal';

export default function AnalyzePage() {
    const [selectedMode, setSelectedMode] = useState<AnalysisMode>('people');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [exifData, setExifData] = useState<ExifData | undefined>(undefined);

    // Rate limit modal state
    const [showRateLimitModal, setShowRateLimitModal] = useState(false);
    const [rateLimitInfo, setRateLimitInfo] = useState<{
        userType: 'anonymous' | 'free' | 'pro';
        resetDate?: string;
        limit?: number;
    }>({ userType: 'anonymous' });

    const handleImageSelect = (file: File) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Reset previous results
        setResult(null);
        setExifData(undefined);

        // Extract EXIF data
        extractExif(file);
    };

    const extractExif = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/extract-exif', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.hasExif) {
                setExifData(data.exif);
            }
        } catch (error) {
            console.error('Failed to extract EXIF:', error);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setResult(null);
        setAnalysisSteps([]);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('mode', selectedMode);

            // Show steps for Military mode only
            if (selectedMode === 'military') {
                setAnalysisSteps(['🔍 Realizando búsqueda en Google Lens...']);
                // Small delay to show first step clearly
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 1. PRIMARY ANALYSIS WITH CLAUDE (includes Google Lens automatically in API if military)
            if (selectedMode === 'military') {
                setAnalysisSteps(prev => [...prev, '🤖 Analizando con Claude Vision...']);
            }

            const claudeResponse = await fetch('/api/analyze-image', {
                method: 'POST',
                body: formData,
            });

            if (claudeResponse.status === 429) {
                const errorData = await claudeResponse.json();

                // Determine user type from error message
                const isAnonymous = errorData.message.includes('sign in');

                setRateLimitInfo({
                    userType: isAnonymous ? 'anonymous' : 'free',
                    resetDate: errorData.resetAt,
                    limit: errorData.limit
                });
                setShowRateLimitModal(true);
                setLoading(false);
                setAnalysisSteps([]);
                return;
            }

            if (!claudeResponse.ok) {
                throw new Error('Analysis failed');
            }

            const claudeResult = await claudeResponse.json();

            // 2. IF MILITARY MODE, ALSO USE GPT-4o FOR IDENTIFICATION
            let gpt4oResult = null;
            if (selectedMode === 'military') {
                setAnalysisSteps(prev => [...prev, '⚙️ Consultando modelo GPT-4o...']);
                try {
                    const gpt4oResponse = await fetch('/api/identify-military', {
                        method: 'POST',
                        body: formData,
                    });

                    if (gpt4oResponse.ok) {
                        const data = await gpt4oResponse.json();
                        gpt4oResult = data.identification;
                    }
                } catch (error) {
                    console.error('GPT-4o identification failed (non-critical):', error);
                    // Non-critical: continue with Claude only
                }
            }

            if (selectedMode === 'military') {
                setAnalysisSteps(prev => [...prev, '✅ Sintetizando resultados...']);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 3. COMBINE RESULTS
            setResult({
                ...claudeResult,
                exifData, // Pass exif data to result for export
                gpt4oIdentification: gpt4oResult
            });

            // Clear steps on success (optional, or keep them until new analysis)
            setAnalysisSteps([]);

        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to analyze image. Please try again.');
            setAnalysisSteps([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 pb-20">
            <EthicalDisclaimer />

            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🔍</span>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">OSINT VISION</h1>
                            <p className="text-xs text-green-500 font-mono">AI-POWERED IMAGE INTELLIGENCE</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* Mode Selector */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">Select Analysis Mode</h2>
                    <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Upload & Preview */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-300">Target Image</h2>
                            <ImageUploader
                                onImageSelect={handleImageSelect}
                                currentImage={imagePreview}
                            />
                        </div>

                        {/* Analyze Button */}
                        {selectedFile && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className={`
                  w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3
                  ${loading
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-500 text-white'}
                `}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <span>🔍</span>
                                        Analyze with {selectedMode.toUpperCase()} Mode
                                    </>
                                )}
                            </button>
                        )}

                        {/* Analysis Progress Steps (Military Mode) */}
                        {loading && analysisSteps.length > 0 && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-3">
                                    {analysisSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            {i === analysisSteps.length - 1 ? (
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                                            ) : (
                                                <span className="text-green-400 text-xs">✓</span>
                                            )}
                                            <span className={`${i === analysisSteps.length - 1 ? 'text-blue-200 font-medium' : 'text-gray-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EXIF Data */}
                        {exifData && (
                            <ExifDisplay exifData={exifData} />
                        )}
                    </div>

                    {/* Right Column: Results */}
                    <div className="space-y-6">
                        <AnalysisResults result={result} loading={loading} />

                        {/* Export Buttons */}
                        {result && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h2 className="text-lg font-semibold mb-4 text-gray-300">Export Report</h2>
                                <ExportButtons result={result} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-4 py-6 mt-12 border-t border-gray-800 text-center text-sm text-gray-500">
                <p>OSINT Vision v1.0 | For Authorized Security Research Only</p>
                <p className="mt-1">Built by @bcansan</p>
            </footer>

            <RateLimitModal
                show={showRateLimitModal}
                onClose={() => setShowRateLimitModal(false)}
                userType={rateLimitInfo.userType}
                resetDate={rateLimitInfo.resetDate}
                limit={rateLimitInfo.limit}
            />
        </div>
    );
}
