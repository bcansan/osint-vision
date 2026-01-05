export type AnalysisMode = 'people' | 'location' | 'military' | 'ocr';

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
