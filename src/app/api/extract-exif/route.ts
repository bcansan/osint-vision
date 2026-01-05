import { NextRequest, NextResponse } from 'next/server';
import exifr from 'exifr';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Convert to buffer
        const buffer = await image.arrayBuffer();

        // Extract EXIF data
        const exifData = await exifr.parse(buffer, {
            gps: true,
            tiff: true,
            exif: true,
            iptc: true,
            icc: true,
        });

        // Clean and structure the data
        const cleanedExif = exifData ? {
            camera: exifData.Make && exifData.Model
                ? `${exifData.Make} ${exifData.Model}`
                : undefined,
            lens: exifData.LensModel,
            dateTime: exifData.DateTimeOriginal || exifData.DateTime,
            gps: exifData.latitude && exifData.longitude
                ? {
                    latitude: exifData.latitude,
                    longitude: exifData.longitude,
                    altitude: exifData.GPSAltitude
                }
                : undefined,
            software: exifData.Software,
            orientation: exifData.Orientation,
            iso: exifData.ISO,
            focalLength: exifData.FocalLength,
            aperture: exifData.FNumber,
            shutterSpeed: exifData.ExposureTime,
            flash: exifData.Flash,
        } : {};

        return NextResponse.json({
            exif: cleanedExif,
            hasExif: !!exifData && Object.keys(exifData).length > 0
        });

    } catch (error) {
        console.error('Error extracting EXIF:', error);
        return NextResponse.json(
            { error: 'Failed to extract EXIF data', hasExif: false },
            { status: 200 } // Return 200 even on error, just indicate no EXIF
        );
    }
}
