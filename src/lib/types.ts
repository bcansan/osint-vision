export type AnalysisMode = 'people' | 'location' | 'military' | 'ocr';

export type UserTier = 'free' | 'pro' | 'developer';

export interface User {
    id: string;
    clerk_id: string;
    email: string;
    tier: UserTier;
    analyses_used: number;
    analyses_limit: number;
    period_start: string;
    period_end: string;
}

export interface UsageLog {
    id: string;
    user_id: string;
    mode: AnalysisMode;
    cost: number;
    success: boolean;
    error_message?: string;
    timestamp: string;
}

export interface AnalysisResult {
    mode: AnalysisMode;
    timestamp: string;
    analysis: string; // Markdown from Claude
    exifData?: ExifData;
    confidence?: 'very-low' | 'low' | 'medium' | 'high';
    gpt4oIdentification?: string; // NEW: GPT-4o identification for military mode
}

export interface ExifData {
    make?: string;
    model?: string;
    dateTime?: string;
    gps?: {
        latitude: number;
        longitude: number;
        altitude?: number;
    };
    software?: string;
    orientation?: number;
    [key: string]: any;
}

export interface ModeConfig {
    id: AnalysisMode;
    name: string;
    icon: string;
    description: string;
    color: string;
    borderColor: string;
}
