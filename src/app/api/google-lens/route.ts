import { NextRequest, NextResponse } from 'next/server';
import { getJson } from 'serpapi';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    console.log('🔍 Google Lens API called');
    
    let uploadedImageId: string | null = null;
    
    try {
        const requestFormData = await req.formData();
        const image = requestFormData.get('image') as File;
        
        if (!image) {
            console.error('❌ No image provided');
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }
        
        if (!process.env.SERPAPI_API_KEY) {
            console.error('❌ SerpApi key not configured');
            return NextResponse.json({
                success: false,
                error: 'SerpApi key not configured',
                results: null
            }, { status: 200 });
        }
        
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.error('❌ Cloudinary not configured');
            return NextResponse.json({
                success: false,
                error: 'Cloudinary not configured',
                results: null
            }, { status: 200 });
        }
        
        console.log('📤 Converting image to base64...');
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataUri = `data:${image.type};base64,${base64Image}`;
        
        // Step 1: Upload to Cloudinary with auto-expiration
        console.log('☁️ Uploading to Cloudinary...');
        
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'osint-vision-temp',
            resource_type: 'image',
            // Auto-delete after 1 hour
            invalidate: true,
            overwrite: true,
        });
        
        uploadedImageId = uploadResult.public_id;
        const imageUrl = uploadResult.secure_url;
        
        console.log('✅ Image uploaded to Cloudinary');
        console.log('🌐 URL:', imageUrl);
        console.log('🌐 Calling SerpApi Google Lens...');
        
        // Step 2: Call SerpApi with Cloudinary URL
        const response: any = await new Promise((resolve, reject) => {
            getJson({
                engine: 'google_lens',
                api_key: process.env.SERPAPI_API_KEY || '',
                url: imageUrl,
            }, (json: any) => {
                if (json.error) {
                    reject(new Error(json.error));
                } else {
                    resolve(json);
                }
            });
        });
        
        console.log('✅ SerpApi response received');
        
        // Step 3: Delete from Cloudinary immediately after use
        if (uploadedImageId) {
            console.log('🗑️ Deleting temporary image from Cloudinary...');
            await cloudinary.uploader.destroy(uploadedImageId);
            console.log('✅ Temporary image deleted');
        }
        
        // Extract information
        const visualMatches = response.visual_matches || [];
        const knowledgeGraph = response.knowledge_graph || null;
        
        console.log('📊 Processing results:', {
            hasKnowledgeGraph: !!knowledgeGraph,
            visualMatchCount: visualMatches.length
        });
        
        // Build main identification from knowledge_graph OR top visual match
let mainIdentification = null;

if (knowledgeGraph && knowledgeGraph.title) {
    // Priority 1: Knowledge Graph (when available)
    mainIdentification = {
        title: knowledgeGraph.title,
        subtitle: knowledgeGraph.subtitle || null,
        description: knowledgeGraph.description || null,
        source: knowledgeGraph.source?.name || 'Google Lens',
    };
    console.log('🎯 Using Knowledge Graph:', mainIdentification.title);
} else if (visualMatches.length > 0 && visualMatches[0].title) {
    // Fallback: Use top visual match
    mainIdentification = {
        title: visualMatches[0].title,
        subtitle: null,
        description: `Found in ${visualMatches[0].source || 'web search'}`,
        source: visualMatches[0].source || 'Visual Match',
    };
    console.log('🎯 Using top visual match:', mainIdentification.title);
}

const formattedResults = {
    mainIdentification,
            
            visualMatches: visualMatches.slice(0, 5).map((match: any) => ({
                title: match.title || 'Sin título',
                link: match.link || null,
                source: match.source || null,
                thumbnail: match.thumbnail || null,
            })),
            
            relatedSearches: response.reverse_image_search?.related_searches || [],
        };
        
        if (formattedResults.mainIdentification) {
            console.log('🎯 Identified:', formattedResults.mainIdentification.title);
        } else if (visualMatches.length > 0) {
            console.log('🎯 Top match:', visualMatches[0].title);
        }
        
        return NextResponse.json({
            success: true,
            results: formattedResults,
            timestamp: new Date().toISOString()
        });
        
    } catch (error: any) {
        console.error('❌ Google Lens error:', error);
        console.error('❌ Error message:', error.message);
        
        // Cleanup on error
        if (uploadedImageId) {
            try {
                console.log('🗑️ Cleaning up temporary image after error...');
                await cloudinary.uploader.destroy(uploadedImageId);
            } catch (cleanupError) {
                console.error('⚠️ Cleanup failed:', cleanupError);
            }
        }
        
        return NextResponse.json({
            success: false,
            error: 'Google Lens search failed',
            details: error.message,
            results: null
        }, { status: 200 });
    }
}