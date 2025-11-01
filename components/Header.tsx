import React from 'react';
import type { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const ChefHatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B6B]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 1.63.47 3.14 1.28 4.43L5 17h14l-1.28-3.57A6.94 6.94 0 0 0 19 9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm-5 11v2h10v-2H7z"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems: { id: AppView; label: string }[] = [
    { id: 'browse', label: 'Browse Recipes' },
    { id: 'chat', label: 'Chat with Chef' },
    { id: 'image', label: 'Recipe from Photo' },
  ];

  const getButtonClass = (view: AppView) => {
    const baseClass = "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]";
    if (currentView === view) {
      return `${baseClass} bg-[#FF6B6B] text-white shadow-md`;
    }
    return `${baseClass} text-gray-600 hover:bg-[#FFE6E6] hover:text-[#FF6B6B]`;
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ChefHatIcon />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              Culinary Compass
            </h1>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={getButtonClass(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
