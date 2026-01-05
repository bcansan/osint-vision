import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.warn('OPENAI_API_KEY is not set. Skipping GPT-4o identification.');
            return NextResponse.json({ identification: null, error: 'API key missing' });
        }

        const openai = new OpenAI({ apiKey });

        const formData = await req.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Convert to base64
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${image.type};base64,${base64}`;

        // Call GPT-4o-mini with specialized military prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Eres un experto en identificación de equipamiento militar. Analiza esta imagen e identifica:

1. **TIPO DE VEHÍCULO/ARMA**: (tank, APC, IFV, artillery, aircraft, etc.)
2. **MODELO ESPECÍFICO**: Nombre exacto del modelo y variante si es posible
3. **PAÍS DE ORIGEN**: Fabricante y país de producción
4. **CONFIANZA**: Tu nivel de certeza (Baja/Media/Alta)
5. **CARACTERÍSTICAS CLAVE**: Los 3-4 elementos visuales distintivos que usaste para identificar
6. **MODELOS ALTERNATIVOS**: 2-3 modelos similares que podrían confundirse con este

Responde en español, de forma técnica pero concisa. Si no estás seguro, admítelo claramente. Usa formato markdown con secciones claras.

IMPORTANTE: Sé honesto sobre tu nivel de confianza. Si solo ves características generales, di que la confianza es baja o media.`
                        },
                        {
                            type: 'image_url',
                            image_url: { url: dataUrl }
                        }
                    ]
                }
            ],
            max_tokens: 600,
            temperature: 0.3 // More deterministic
        });

        const identification = response.choices[0].message.content;

        return NextResponse.json({
            identification,
            model: 'gpt-4o-mini',
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('OpenAI identification error:', error);
        return NextResponse.json(
            {
                error: 'Identification failed',
                details: error.message,
                identification: null
            },
            { status: 500 }
        );
    }
}
