interface SpellCheckResponse {
  suggestions: string[];
}

export const checkSpelling = async (word: string): Promise<string[]> => {
  try {
    // Using a free spell-checking API
    const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=5`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    // Filter out the exact word and return suggestions
    return data
      .filter((item: any) => item.word.toLowerCase() !== word.toLowerCase())
      .slice(0, 3)
      .map((item: any) => item.word);
  } catch (error) {
    console.error('Spell check error:', error);
    return [];
  }
};
