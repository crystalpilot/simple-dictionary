import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  word?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, word }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-semibold text-red-800">Word Not Found</h3>
      </div>
      <p className="text-red-700 leading-relaxed">
        {word ? `Sorry, we couldn't find a definition for "${word}".` : message}
      </p>
      <p className="text-red-600 text-sm mt-2">
        Please check the spelling and try again.
      </p>
    </div>
  );
};