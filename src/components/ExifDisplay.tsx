'use client';

import { ExifData } from '@/lib/types';

interface ExifDisplayProps {
    exifData?: ExifData;
}

export function ExifDisplay({ exifData }: ExifDisplayProps) {
    if (!exifData || Object.keys(exifData).length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">📊 EXIF Metadata</h3>
                <p className="text-gray-500 text-sm italic">No EXIF data found in this image</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
                <h3 className="text-gray-300 text-sm font-bold uppercase tracking-wider">📊 EXIF Metadata</h3>
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {exifData.camera && (
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs">Camera:</span>
                        <span className="text-white font-mono">{exifData.camera}</span>
                    </div>
                )}

                {exifData.lens && (
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs">Lens:</span>
                        <span className="text-white font-mono">{exifData.lens}</span>
                    </div>
                )}

                {exifData.dateTime && (
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs">Date:</span>
                        <span className="text-white font-mono">
                            {new Date(exifData.dateTime).toLocaleString()}
                        </span>
                    </div>
                )}

                {exifData.software && (
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs">Software:</span>
                        <span className="text-white font-mono">{exifData.software}</span>
                    </div>
                )}

                {exifData.iso && (
                    <div>
                        <span className="block text-gray-500 text-xs">ISO:</span>
                        <span className="text-white font-mono">{exifData.iso}</span>
                    </div>
                )}

                {exifData.focalLength && (
                    <div>
                        <span className="block text-gray-500 text-xs">Focal Length:</span>
                        <span className="text-white font-mono">{exifData.focalLength}mm</span>
                    </div>
                )}

                {exifData.gps && (
                    <div className="col-span-full bg-gray-900/50 p-3 rounded border border-gray-700/50 mt-2">
                        <span className="block text-gray-500 text-xs mb-1">GPS Location:</span>
                        <div className="font-mono text-green-400 truncate">
                            Latitude: {exifData.gps.latitude.toFixed(6)} | Longitude: {exifData.gps.longitude.toFixed(6)}
                            {exifData.gps.altitude && ` | Altitude: ${exifData.gps.altitude}m`}
                        </div>
                        <a
                            href={`https://www.google.com/maps?q=${exifData.gps.latitude},${exifData.gps.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-400 text-xs mt-2 inline-block hover:underline"
                        >
                            View on Google Maps →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
