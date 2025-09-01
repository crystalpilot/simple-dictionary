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
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* Word Header */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
              {entry.word}
            </h1>
            {phoneticText && (
              <p className="text-xl text-gray-600 mt-2 font-mono">
                {phoneticText}
              </p>
            )}
          </div>
          {hasAudio && audioUrl && (
            <button
              onClick={() => playAudio(audioUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
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
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-600 capitalize">
                {meaning.partOfSpeech}
              </h2>
            </div>
            
            <div className="space-y-4 ml-8">
              {meaning.definitions.map((definition, defIndex) => (
                <div key={defIndex} className="space-y-2">
                  <p className="text-gray-800 leading-relaxed">
                    <span className="inline-block w-6 h-6 bg-gray-100 text-gray-600 text-sm rounded-full text-center leading-6 mr-3 font-medium">
                      {defIndex + 1}
                    </span>
                    {definition.definition}
                  </p>
                  
                  {definition.example && (
                    <p className="text-gray-600 italic ml-9 pl-4 border-l-2 border-gray-200">
                      "{definition.example}"
                    </p>
                  )}
                  
                  {definition.synonyms && definition.synonyms.length > 0 && (
                    <div className="ml-9">
                      <span className="text-sm font-medium text-gray-500">Synonyms: </span>
                      <span className="text-sm text-blue-600">
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