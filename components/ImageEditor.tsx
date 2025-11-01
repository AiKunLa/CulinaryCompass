import React, { useState } from 'react';
import { editImage } from '../services/geminiService';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
        <span className="text-gray-700">Conjuring up your new image...</span>
    </div>
);


const ImageEditor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditedImage(null);
            setError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and provide an editing prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setEditedImage(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const result = await editImage(base64Image, imageFile.type, prompt);
            setEditedImage(`data:${imageFile.type};base64,${result}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900">AI Image Editor</h2>
                <p className="mt-4 text-lg text-gray-600">Transform your images with a simple text prompt. Let your creativity run wild!</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
                 <div>
                    <label htmlFor="file-upload" className="block text-lg font-semibold text-gray-800 mb-3">1. Upload an Image</label>
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-[#FF6B6B] hover:bg-gray-50 transition-colors relative">
                        <input id="file-upload" name="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">Click or drag to upload</p>
                                <p className="text-xs">PNG, JPG, WEBP</p>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="prompt" className="block text-lg font-semibold text-gray-800 mb-3">2. Describe Your Edit</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter, make it look like a watercolor painting..."
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!imageFile || !prompt.trim() || isLoading}
                    className="w-full px-8 py-4 rounded-lg bg-[#FF6B6B] text-white text-lg font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]"
                >
                    {isLoading ? 'Generating...' : '✨ Generate Image'}
                </button>
                {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
            </div>

            {isLoading && (
                 <div className="mt-8 flex justify-center items-center">
                    <Spinner />
                </div>
            )}

            {(imagePreview && editedImage) && (
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                     <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Result</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Original</h3>
                            <img src={imagePreview} alt="Original" className="w-full object-contain rounded-lg shadow-md mx-auto" />
                        </div>
                         <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edited</h3>
                            <img src={editedImage} alt="Edited" className="w-full object-contain rounded-lg shadow-md mx-auto" />
                             <a 
                                href={editedImage} 
                                download="edited-image.png"
                                className="mt-6 inline-block px-8 py-3 rounded-lg bg-[#4CAF50] text-white font-semibold shadow-md transition-all duration-300 hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]"
                            >
                                Download Image
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEditor;
