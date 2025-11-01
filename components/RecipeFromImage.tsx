import React, { useState, useRef, useEffect } from 'react';
import { getRecipeFromImage } from '../services/geminiService';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="text-white">Analyzing your delicious dish...</span>
    </div>
);

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const formatText = (inputText: string) => {
        return inputText
            .split('\n')
            .map(line => {
                if (line.startsWith('### ')) return `<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-800">${line.substring(4)}</h3>`;
                if (line.startsWith('**')) return `<p class="font-semibold text-gray-700 my-2">${line.replace(/\*\*/g, '')}</p>`;
                if (line.startsWith('* ')) return `<li class="ml-6 list-disc text-gray-600">${line.substring(2)}</li>`;
                if (line.match(/^\d+\./)) return `<li class="ml-6 list-decimal text-gray-600">${line.substring(line.indexOf(' ')+1)}</li>`;
                if (line.trim() === '') return '<br />';
                return `<p class="text-gray-600 my-1">${line}</p>`;
            })
            .join('');
    };

    return <div dangerouslySetInnerHTML={{ __html: formatText(text) }} />;
};

const RecipeFromImage: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access the camera. Please check permissions and try again.");
                setIsCameraOpen(false);
            }
        };

        if (isCameraOpen) {
            startCamera();
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOpen]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRecipe('');
            setError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const capturedFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setImageFile(capturedFile);
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(blob);

                        setRecipe('');
                        setError('');
                        setIsCameraOpen(false);
                    }
                }, 'image/jpeg');
            }
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
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRecipe('');

        try {
            const base64Image = await fileToBase64(imageFile);
            const prompt = "This is a photo of a dish. Please identify it and provide a detailed recipe. Include a title, a brief description, a list of ingredients, and step-by-step instructions. Please format the response using Markdown.";
            const result = await getRecipeFromImage(base64Image, imageFile.type, prompt);
            setRecipe(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900">What's Cooking?</h2>
                <p className="mt-4 text-lg text-gray-600">Upload a photo of a dish, and our AI chef will tell you how to make it!</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                {!isCameraOpen ? (
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                            <label htmlFor="file-upload" className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-[#FF6B6B] hover:bg-gray-50 transition-colors">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-2">Click to upload an image</p>
                                        <p className="text-xs">PNG, JPG, WEBP</p>
                                    </div>
                                )}
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                             <button onClick={() => { setIsCameraOpen(true); setImagePreview(null); setImageFile(null); }} className="w-full mt-4 py-2 px-4 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                                Use Camera
                            </button>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
                            <p className="text-gray-600 text-center md:text-left mb-4">Once you've selected an image, our AI will work its magic to generate a recipe for you.</p>
                            <button
                                onClick={handleSubmit}
                                disabled={!imageFile || isLoading}
                                className="w-full md:w-auto px-8 py-3 rounded-lg bg-[#FF6B6B] text-white font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]"
                            >
                                {isLoading ? 'Generating...' : 'Get Recipe'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-md bg-gray-900"></video>
                        <div className="flex gap-4">
                            <button onClick={handleCapture} className="px-6 py-2 rounded-lg bg-[#FF6B6B] text-white font-semibold shadow-md hover:bg-[#ff5252] transition-colors">Take Photo</button>
                            <button onClick={() => setIsCameraOpen(false)} className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors">Cancel</button>
                        </div>
                    </div>
                )}
                {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            </div>

            {(isLoading || recipe) && (
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    {isLoading && (
                        <div className="flex justify-center items-center h-48 bg-[#FF6B6B] rounded-lg">
                            <Spinner />
                        </div>
                    )}
                    {recipe && (
                        <div>
                             <SimpleMarkdown text={recipe} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeFromImage;
