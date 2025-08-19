import { useState } from 'react';
import { Search } from 'lucide-react';

interface TikTokHeaderProps {
  onTabChange?: (tab: string) => void;
  onSearchFocus?: () => void;
}

export default function TikTokHeader({ onTabChange, onSearchFocus }: TikTokHeaderProps) {
  const [activeTab, setActiveTab] = useState('For You');

  const tabs = ['Following', 'Friends', 'For You'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-black">
      {/* Status bar safe area */}
      <div className="h-[env(safe-area-inset-top)]" />
      
      {/* Main header content */}
      <div className="px-4 py-2">
        {/* Tab navigation */}
        <div className="flex items-center justify-center space-x-6 mb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`relative text-lg font-semibold transition-colors ${
                activeTab === tab ? 'text-white' : 'text-white/60'
              }`}
            >
              {tab}
              {tab === 'Following' && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {activeTab === tab && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
          <button className="ml-4 p-2">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="flex items-center bg-gray-800/50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Explore topics you love"
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
              onFocus={onSearchFocus}
            />
            <button className="bg-gray-700 text-white text-sm px-3 py-1 rounded-md ml-2">
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
