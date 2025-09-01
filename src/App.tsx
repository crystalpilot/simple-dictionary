import React, { useState, useEffect } from 'react';
import { DefinitionCard } from './components/DefinitionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { DarkModeToggle } from './components/DarkModeToggle';
import { fetchWordDefinition } from './services/dictionaryApi';
import { DictionaryEntry } from './types/dictionary';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [definitions, setDefinitions] = useState<DictionaryEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ type: 'notFound' | 'general'; word?: string; message: string } | null>(null);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Global escape key handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (definitions || error || isLoading)) {
        // Reset the app state
        setSearchTerm('');
        setDefinitions(null);
        setError(null);
        setIsLoading(false);
        // Ensure the input is focused for the next word entry
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [definitions, error, isLoading]);

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsLoading(true);
      setError(null);
      setDefinitions(null);

      try {
        const result = await fetchWordDefinition(searchTerm.trim());
        setDefinitions(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        if (errorMessage.includes('404')) {
          setError({ type: 'notFound', word: searchTerm.trim(), message: 'Word not found' });
        } else {
          setError({ type: 'general', message: 'An error occurred while fetching the definition' });
        }
      } finally {
        setIsLoading(false);
      }
    } else if (e.key === 'Escape') {
      // Reset the app state
      setSearchTerm('');
      setDefinitions(null);
      setError(null);
      setIsLoading(false);
      // Ensure the input is focused for the next word entry
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (definitions || error) {
      setDefinitions(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-helvetica transition-colors duration-200">
      <DarkModeToggle />
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Minimalist Search Input */}
        <div className="relative mb-16">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder=""
            className="w-full text-4xl md:text-6xl font-light text-[#FC4949] dark:text-red-400 bg-transparent border-none outline-none placeholder-transparent caret-transparent"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            autoFocus
          />
          
          {/* Custom blinking cursor */}
          <span 
            className={`absolute text-4xl md:text-6xl font-light text-[#FC4949] dark:text-red-400 pointer-events-none transition-opacity duration-75 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              left: `${searchTerm.length * 0.6}em`,
              top: '0',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}
          >
            |
          </span>
          
          {/* Subtle hint text */}
          {!searchTerm && !isLoading && !definitions && !error && (
            <div className="absolute top-full mt-8 text-gray-400 dark:text-gray-500 text-lg font-light">
              Type a word and press Enter
            </div>
          )}
          
          {/* Escape hint text */}
          {(definitions || error) && !isLoading && (
            <div className="absolute top-full mt-8 text-gray-500 dark:text-gray-400 text-lg font-medium bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              ⌨️ Press <kbd className="bg-white dark:bg-gray-700 px-2 py-1 rounded border text-sm">ESC</kbd> to clear and search again
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <ErrorMessage 
            message={error.message} 
            word={error.type === 'notFound' ? error.word : undefined} 
          />
        )}
        
        {definitions && !isLoading && !error && (
          <div className="mt-24 space-y-8">
            {definitions.map((entry, index) => (
              <DefinitionCard key={index} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;