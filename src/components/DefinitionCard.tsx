import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import { DictionaryEntry } from '../types/dictionary';

interface DefinitionCardProps {
  entry: DictionaryEntry;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ entry }) => {
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  const hasAudio = entry.phonetics?.some(p => p.audio);
  const audioUrl = entry.phonetics?.find(p => p.audio)?.audio;
  const phoneticText = entry.phonetic || entry.phonetics?.find(p => p.text)?.text;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 max-w-4xl mx-auto">
      {/* Word Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white capitalize">
              {entry.word}
            </h1>
            {phoneticText && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2 font-mono">
                {phoneticText}
              </p>
            )}
          </div>
          {hasAudio && audioUrl && (
            <button
              onClick={() => playAudio(audioUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
            >
              <Volume2 className="w-5 h-5" />
              <span className="font-medium">Pronounce</span>
            </button>
          )}
        </div>
      </div>

      {/* Meanings */}
      <div className="space-y-8">
        {entry.meanings.map((meaning, meaningIndex) => (
          <div key={meaningIndex} className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 capitalize">
                {meaning.partOfSpeech}
              </h2>
            </div>
            
            <div className="space-y-4 ml-8">
              {meaning.definitions.map((definition, defIndex) => (
                <div key={defIndex} className="space-y-2">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    <span className="inline-block w-6 h-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full text-center leading-6 mr-3 font-medium">
                      {defIndex + 1}
                    </span>
                    {definition.definition}
                  </p>
                  
                  {definition.example && (
                    <p className="text-gray-600 dark:text-gray-400 italic ml-9 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                      "{definition.example}"
                    </p>
                  )}
                  
                  {definition.synonyms && definition.synonyms.length > 0 && (
                    <div className="ml-9">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Synonyms: </span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {definition.synonyms.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};