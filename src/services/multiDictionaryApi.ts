import { DictionaryResponse } from '../types/dictionary';

// Free dictionary API endpoints
const FREE_APIS = {
  freeDictionary: 'https://api.dictionaryapi.dev/api/v2/entries/en',
  urbanDictionary: 'https://api.urbandictionary.com/v0/define',
};

export const fetchMultiSourceDefinition = async (word: string): Promise<DictionaryResponse> => {
  try {
    // 1. Try Free Dictionary API first (most reliable, comprehensive)
    try {
      const freeDictResponse = await fetch(`${FREE_APIS.freeDictionary}/${encodeURIComponent(word)}`);
      if (freeDictResponse.ok) {
        const data = await freeDictResponse.json();
        return data;
      }
    } catch (error) {
      console.log('Free Dictionary API failed:', error);
    }

    // 2. Try Urban Dictionary for slang/modern terms
    try {
      const urbanResponse = await fetch(`${FREE_APIS.urbanDictionary}?term=${encodeURIComponent(word)}`);
      if (urbanResponse.ok) {
        const data = await urbanResponse.json();
        if (data.list && data.list.length > 0) {
          // Convert Urban Dictionary format to our standard format
          return convertUrbanToStandard(data, word);
        }
      }
    } catch (error) {
      console.log('Urban Dictionary API failed:', error);
    }

    // If all free APIs failed, throw an error
    throw new Error('No definitions found from any source');

  } catch (error) {
    console.error('All dictionary APIs failed:', error);
    throw error;
  }
};

// Convert Urban Dictionary format to our standard format
const convertUrbanToStandard = (urbanData: any, word: string): DictionaryResponse => {
  const definitions = urbanData.list || [];
  if (definitions.length === 0) {
    throw new Error('No definitions found');
  }

  return [{
    word: word,
    phonetic: '',
    phonetics: [],
    meanings: [{
      partOfSpeech: 'slang/modern',
      definitions: definitions.slice(0, 3).map((def: any) => ({
        definition: def.definition,
        example: def.example,
        synonyms: []
      }))
    }]
  }];
};
