'use client';

import { useState, useCallback } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    currentImage?: string;
}

export function ImageUploader({ onImageSelect, currentImage }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageSelect(file);
            }
        }
    }, [onImageSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                onImageSelect(file);
            }
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative border-2 border-dashed rounded-lg p-8 transition-all flex flex-col items-center justify-center text-center
        ${dragActive
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'}
        ${currentImage ? 'min-h-[400px]' : 'min-h-[300px]'}
      `}
        >
            {currentImage ? (
                <div className="relative w-full h-full flex flex-col items-center">
                    <img
                        src={currentImage}
                        alt="Preview"
                        className="max-h-[350px] w-auto object-contain rounded-lg mb-4 shadow-lg"
                    />
                    <div className="mt-2">
                        <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">
                            <span>Upload different image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="pointer-events-none">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-xl font-semibold text-gray-300 mb-2">
                        Drag & drop an image here
                    </p>
                    <p className="text-gray-500 mb-6">or</p>
                    <label className="cursor-pointer pointer-events-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors font-medium">
                        <span>Browse Files</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                        Supported: JPG, PNG, GIF, WEBP (max 5MB)
                    </p>
                </div>
            )}
        </div>
    );
}
