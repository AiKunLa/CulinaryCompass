import React, { useState } from 'react';
import { PREDEFINED_RECIPES } from '../constants';
import type { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => (
    <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
        onClick={onClick}
    >
        <img className="w-full h-48 object-cover" src={recipe.imageUrl} alt={recipe.title} />
        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#FF6B6B] transition-colors">{recipe.title}</h3>
            <p className="text-gray-600 text-sm">{recipe.description}</p>
        </div>
    </div>
);

interface RecipeDetailProps {
    recipe: Recipe;
    onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-[#FEFBF6] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
                <img className="w-full h-64 object-cover rounded-t-2xl" src={recipe.imageUrl} alt={recipe.title} />
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 bg-white/70 rounded-full p-2 text-gray-700 hover:bg-white hover:text-black transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h2>
                <p className="text-gray-600 mb-6">{recipe.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-[#FFDAB9] pb-2">Ingredients</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-[#FFDAB9] pb-2">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const RecipeBrowser: React.FC = () => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900">Discover Delicious Recipes</h2>
                <p className="mt-4 text-lg text-gray-600">Explore our curated collection of recipes to find your next favorite meal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {PREDEFINED_RECIPES.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                ))}
            </div>
            {selectedRecipe && <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        </div>
    );
};

export default RecipeBrowser;
