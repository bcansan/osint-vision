'use client';

import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '@/lib/types';
import { ReverseSearchButtons } from './ReverseSearchButtons';

interface AnalysisResultsProps {
    result: AnalysisResult | null;
    loading: boolean;
}

export function AnalysisResults({ result, loading }: AnalysisResultsProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-300 animate-pulse text-lg">Analyzing image with Claude Vision...</p>
                <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl border border-gray-700/50 border-dashed">
                <p className="text-gray-500">Upload an image to start analysis</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
            <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-green-500">⚡</span> Analysis Results
                </h2>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {new Date(result.timestamp).toLocaleString()}
                </span>
            </div>

            <div className="p-8 prose prose-invert max-w-none">
                {/* GPT-4o Identification Box - Military Mode Only */}
                {result.mode === 'military' && result.gpt4oIdentification && (
                    <>
                        <div className="mb-6 p-5 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-xl shadow-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="text-3xl">🤖</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-blue-400 mb-1">
                                        Identificación Automática (GPT-4o)
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Identificación basada en base de conocimiento especializada de equipamiento militar
                                    </p>
                                </div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-4 border border-blue-600/30">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>
                                        {result.gpt4oIdentification}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                                <p className="text-xs text-yellow-300">
                                    ⚠️ <strong>Verificación cruzada recomendada:</strong> Esta identificación debe ser
                                    comparada con el análisis detallado de Claude (abajo) y verificada mediante reverse
                                    image search. Ambos sistemas pueden cometer errores - la coincidencia entre ambos
                                    aumenta la confianza.
                                </p>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                                <span className="text-sm text-gray-400 font-semibold">
                                    Análisis Técnico OSINT Detallado (Claude)
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                            </div>
                        </div>
                    </>
                )}

                <ReactMarkdown
                    components={{
                        h2: ({ node, ...props }) => <h2 className="text-xl text-green-400 font-bold mt-8 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg text-blue-400 font-bold mt-6 mb-3" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 space-y-2 text-gray-300" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 space-y-2 text-gray-300" {...props} />,
                        p: ({ node, ...props }) => <p className="leading-relaxed mb-4 text-gray-300" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-900 px-1 py-0.5 rounded text-yellow-500 text-sm font-mono" {...props} />,
                    }}
                >
                    {result.analysis}
                </ReactMarkdown>

                {(result.mode === 'location' || result.mode === 'people' || result.mode === 'military') && (
                    <ReverseSearchButtons mode={result.mode} className="mt-6" />
                )}
            </div>
        </div>
    );
}
