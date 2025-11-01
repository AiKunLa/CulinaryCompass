import React, { useState } from 'react';
import type { AppView } from './types';
import Header from './components/Header';
import RecipeBrowser from './components/RecipeBrowser';
import RecipeChat from './components/RecipeChat';
import RecipeFromImage from './components/RecipeFromImage';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('browse');

  const renderContent = () => {
    switch (view) {
      case 'browse':
        return <RecipeBrowser />;
      case 'chat':
        return <RecipeChat />;
      case 'image':
        return <RecipeFromImage />;
      case 'edit':
        return <ImageEditor />;
      default:
        return <RecipeBrowser />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFBF6] font-sans text-gray-800">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Built with Gemini & React</p>
      </footer>
    </div>
  );
};

export default App;
