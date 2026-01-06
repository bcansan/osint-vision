import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { ANALYSIS_PROMPTS } from '@/lib/prompts';
import { AnalysisMode } from '@/lib/types';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUser, createUser, incrementUsage, logUsage } from '@/lib/db';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image') as File;
        const mode = formData.get('mode') as AnalysisMode;

        // Get auth info
        const { userId } = await auth();
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || null;

        // Get IP for rate limiting
        const ip = req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, email, ip);

        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                limit: rateLimit.limit,
                remaining: 0,
                resetAt: rateLimit.resetAt,
                message: userId
                    ? 'Monthly limit reached. Please upgrade to Pro.'
                    : 'Free analysis used. Please sign in to continue.'
            }, { status: 429 });
        }

        if (!image || !mode) {
            return NextResponse.json(
                { error: 'Image and mode are required' },
                { status: 400 }
            );
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                { error: 'API Key not configured. Please set ANTHROPIC_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        // Convert image to base64
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // Determine media type
        const mediaType = image.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

        // For Military mode only: Get Google Lens identification first
        let googleLensContext = '';
        if (mode === 'military' || mode === 'location') {
            console.log(`🎖️ ${mode.toUpperCase()} MODE DETECTED`);
            console.log('🎖️ Mode value:', mode);
            console.log('🎖️ Will attempt Google Lens call...');

            try {
                console.log('🔍 Inside Google Lens try block');

                // Create FormData for Google Lens API
                const lensFormData = new FormData();
                lensFormData.append('image', image);
                console.log('📦 FormData created');

                // Call our Google Lens endpoint
                // Force production URL for API calls
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    'https://osint-vision.vercel.app';
                console.log('🌐 Base URL:', baseUrl);

                const lensResponse = await fetch(`${baseUrl}/api/google-lens`, {
                    method: 'POST',
                    body: lensFormData,
                });
                console.log('📥 Lens response received, status:', lensResponse.status);

                if (lensResponse.ok) {
                    const lensData = await lensResponse.json();
                    console.log('📊 Lens data received:', {
                        success: lensData.success,
                        hasResults: !!lensData.results
                    });

                    if (lensData.success && lensData.results) {
                        const { mainIdentification, visualMatches } = lensData.results;

                        // Build context string for Claude
                        if (mainIdentification && mainIdentification.title) {
                            console.log('✅ Google Lens identified:', mainIdentification.title);

                            const accuracy = mode === 'military' ? '~100%' : '~95%';
                            const targetPrompt = mode === 'military' ? 'equipamiento militar' : 'el lugar/landmark';

                            googleLensContext = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 INFORMACIÓN PRIORITARIA DE GOOGLE LENS (Precisión ${accuracy})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Google Lens ha identificado esta imagen como:

**${mainIdentification.title}**
${mainIdentification.subtitle ? `(${mainIdentification.subtitle})` : ''}

${mainIdentification.description || 'Sin descripción disponible'}

${mainIdentification.source ? `Fuente principal: ${mainIdentification.source}` : ''}

${visualMatches.length > 0 ? `
FUENTES CONFIRMADAS (${visualMatches.length} coincidencias visuales):
${visualMatches.map((match: any, i: number) =>
                                `${i + 1}. "${match.title}" - ${match.source || 'fuente web'}`
                            ).join('\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ INSTRUCCIONES CRÍTICAS PARA TU ANÁLISIS:

1. Google Lens tiene ${accuracy} de precisión para ${targetPrompt}
2. Usa esta identificación como PUNTO DE PARTIDA CONFIRMADO
3. NO intentes re-identificar desde cero
4. Tu rol es VALIDAR con análisis visual y EXPANDIR con detalles técnicos
5. Si tu análisis contradice Google Lens, MENCIONA LA DISCREPANCIA claramente
6. Proporciona análisis técnico detallado del ${mode === 'military' ? 'modelo identificado' : 'lugar identificado'}
7. Agrega contexto operacional, capacidades, y especificaciones

CONFIANZA BASE: Si tu análisis visual concuerda con Google Lens → ${accuracy}
Si hay discrepancia → Explica por qué y mantén confianza baja

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
                        } else {
                            console.log('⚠️ Google Lens: No main identification found');
                        }
                    } else {
                        console.log('⚠️ Google Lens: No success or no results');
                    }
                } else {
                    console.log('❌ Lens response not OK, status:', lensResponse.status);
                }
            } catch (error) {
                console.error('❌ Google Lens integration failed (non-critical):', error);
                console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
            }
        }

        // Get the appropriate prompt for the mode and prepend Lens context if available
        const systemPrompt = googleLensContext + ANALYSIS_PROMPTS[mode];

        // Call Claude Vision API
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929", // Keeping the exact model requested
            max_tokens: 4000,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mediaType,
                                data: base64Image,
                            },
                        },
                        {
                            type: "text",
                            text: systemPrompt
                        }
                    ],
                },
            ],
        });

        const analysisText = message.content[0].type === 'text' ? message.content[0].text : '';

        // After successful analysis, increment usage and log
        if (userId) {
            try {
                let dbUser = await getUser(userId);
                if (!dbUser && email) {
                    dbUser = await createUser(userId, email);
                }
                if (dbUser) {
                    await incrementUsage(dbUser.id);
                    await logUsage(dbUser.id, mode, getCost(mode), true);
                }
            } catch (dbError) {
                console.error('Error updating usage in DB:', dbError);
            }
        }

        return NextResponse.json({
            analysis: analysisText,
            mode,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Error analyzing image:', error);

        // Log failed usage if we have a user
        const { userId } = await auth();
        if (userId) {
            try {
                const dbUser = await getUser(userId);
                if (dbUser) {
                    const formData = await req.formData();
                    const mode = formData.get('mode') as string;
                    await logUsage(
                        dbUser.id,
                        mode,
                        0,
                        false,
                        error instanceof Error ? error.message : 'Unknown error'
                    );
                }
            } catch (logError) {
                console.error('Error logging failed usage:', logError);
            }
        }

        return NextResponse.json(
            { error: 'Failed to analyze image' },
            { status: 500 }
        );
    }
}

function getCost(mode: string): number {
    switch (mode) {
        case 'military':
        case 'location':
            return 0.013; // Google Lens + Claude
        default:
            return 0.003; // Claude only
    }
}
