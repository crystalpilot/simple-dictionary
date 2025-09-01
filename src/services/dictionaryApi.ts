import { DictionaryResponse } from '../types/dictionary';

const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const fetchWordDefinition = async (word: string): Promise<DictionaryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch definition: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dictionary API error:', error);
    throw error;
  }
};