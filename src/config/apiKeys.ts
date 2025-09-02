// API Keys configuration for dictionary services
// Currently configured for free APIs only

export const API_KEYS = {
  // Free APIs (no keys needed)
  FREE_DICTIONARY: 'enabled',
  URBAN_DICTIONARY: 'enabled',
  
  // Premium APIs (disabled for now)
  OXFORD_APP_ID: '',
  OXFORD_APP_KEY: '',
  MERRIAM_WEBSTER_KEY: '',
  WORDS_API_KEY: '',
};

// Check if any premium APIs are configured
export const hasPremiumAPIs = () => {
  return false; // Currently using free APIs only
};

// Get available API sources
export const getAvailableSources = () => {
  return ['Free Dictionary API', 'Urban Dictionary'];
};
