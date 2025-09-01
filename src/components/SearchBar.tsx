import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a word to search..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-l-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          className="px-8 py-4 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm border-2 border-blue-600 hover:border-blue-700 disabled:border-gray-400"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};