import React, { useState, useEffect } from 'react';
import { DefinitionCard } from './components/DefinitionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { DarkModeToggle } from './components/DarkModeToggle';
import { fetchWordDefinition } from './services/dictionaryApi';
import { fetchMultiSourceDefinition } from './services/multiDictionaryApi';
import { checkSpelling } from './services/spellCheckApi';
import { DictionaryEntry } from './types/dictionary';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [definitions, setDefinitions] = useState<DictionaryEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ type: 'notFound' | 'general'; word?: string; message: string } | null>(null);
  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);

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
        setCursorPosition(0); // Reset cursor to beginning
        setDefinitions(null);
        setError(null);
        setSpellingSuggestions([]);
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
        // Try multi-source dictionary first, fallback to single source
        let result;
        try {
          result = await fetchMultiSourceDefinition(searchTerm.trim());
        } catch (multiError) {
          // Fallback to original dictionary API
          result = await fetchWordDefinition(searchTerm.trim());
        }
        setDefinitions(result);
        setSpellingSuggestions([]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        if (errorMessage.includes('404')) {
          setError({ type: 'notFound', word: searchTerm.trim(), message: 'Word not found' });
          // Get spelling suggestions for misspelled words
          const suggestions = await checkSpelling(searchTerm.trim());
          setSpellingSuggestions(suggestions);
        } else {
          setError({ type: 'general', message: 'An error occurred while fetching the definition' });
          setSpellingSuggestions([]);
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
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Calculate cursor position based on actual text width
    const input = e.target;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      // Use responsive font sizing for cursor positioning
      const fontSize = window.innerWidth >= 1280 ? 64 : 
                     window.innerWidth >= 1024 ? 56 : 
                     window.innerWidth >= 768 ? 48 : 
                     window.innerWidth >= 640 ? 40 : 32;
      context.font = `400 ${fontSize}px Helvetica`;
      const textWidth = context.measureText(newValue).width;
      setCursorPosition(textWidth);
    }
    
    if (definitions || error) {
      setDefinitions(null);
      setError(null);
      setSpellingSuggestions([]);
    }
    
    // Reset cursor position if input is empty
    if (newValue === '') {
      setCursorPosition(0);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-helvetica transition-colors duration-200">
      <DarkModeToggle />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Minimalist Search Input */}
        <div className="relative mb-12 sm:mb-16">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder=""
            className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-[#FC4949] dark:text-red-400 bg-transparent border-none outline-none placeholder-transparent caret-transparent"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            autoFocus
          />
          
          {/* Custom blinking cursor */}
          <span 
            className={`absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-[#FC4949] dark:text-red-400 pointer-events-none transition-opacity duration-75 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              left: `${cursorPosition}px`,
              top: '0',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}
          >
            |
          </span>
          
          {/* Subtle hint text */}
          {!searchTerm && !isLoading && !definitions && !error && (
            <div className="absolute top-full mt-4 sm:mt-6 lg:mt-8 text-gray-400 dark:text-gray-500 text-sm sm:text-base lg:text-lg font-light">
              Type a word and press Enter
            </div>
          )}
          
          {/* Escape hint text */}
          {(definitions || error) && !isLoading && (
            <div className="absolute top-full mt-4 sm:mt-6 lg:mt-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-medium bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-lg">
              ⌨️ Press <kbd className="bg-white dark:bg-gray-700 px-1.5 sm:px-2 py-1 rounded border text-xs sm:text-sm">ESC</kbd> to clear and search again
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="mt-20 sm:mt-24 lg:mt-32">
            <ErrorMessage 
              message={error.message} 
              word={error.type === 'notFound' ? error.word : undefined} 
            />
            {spellingSuggestions.length > 0 && (
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-3">
                  Did you mean one of these?
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {spellingSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={async () => {
                        setSearchTerm(suggestion);
                        // Update cursor position for the new word
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        if (context) {
                          // Use responsive font sizing for cursor positioning
                          const fontSize = window.innerWidth >= 1280 ? 64 : 
                                         window.innerWidth >= 1024 ? 56 : 
                                         window.innerWidth >= 768 ? 48 : 
                                         window.innerWidth >= 640 ? 40 : 32;
                          context.font = `400 ${fontSize}px Helvetica`;
                          const textWidth = context.measureText(suggestion).width;
                          setCursorPosition(textWidth);
                        }
                        setError(null);
                        setSpellingSuggestions([]);
                        setIsLoading(true);
                        
                        try {
                          // Automatically search for the suggested word
                          let result;
                          try {
                            result = await fetchMultiSourceDefinition(suggestion);
                          } catch (multiError) {
                            // Fallback to original dictionary API
                            result = await fetchWordDefinition(suggestion);
                          }
                          setDefinitions(result);
                        } catch (err) {
                          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                          if (errorMessage.includes('404')) {
                            setError({ type: 'notFound', word: suggestion, message: 'Word not found' });
                          } else {
                            setError({ type: 'general', message: 'An error occurred while fetching the definition' });
                          }
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {definitions && !isLoading && !error && (
          <div className="mt-16 sm:mt-20 lg:mt-24 space-y-6 sm:space-y-8">
            {definitions.map((entry, index) => (
              <DefinitionCard 
                key={index} 
                entry={entry} 
                source={entry.meanings?.[0]?.partOfSpeech === 'slang/modern' ? 'Urban Dictionary' : 'Free Dictionary API'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;