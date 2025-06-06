/**
 * Utility functions for working with localStorage
 */

// Get data from localStorage with error handling
export const getLocalStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage with error handling
export const saveLocalStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Initialize localStorage with default values
export const initializeLocalStorage = () => {
  const defaultData = {
    facultyData: [],
    feedbackData: [],
    notesData: [],
    achievementsData: [],
    siteSettings: {
      siteName: 'ECE Department Portal',
      logo: null
    },
    feedbackFormSettings: {
      title: 'Student Feedback Form',
      introText: 'Your input helps us improve our teaching and course content.',
      requireRegisterNumber: true,
      showTeachingRating: true,
      showContentRating: true,
      showInteractionRating: true,
      showOverallRating: true,
      showComments: true
    }
  };

  Object.entries(defaultData).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      saveLocalStorageData(key, value);
    }
  });
};

// Check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    const testKey = 'test_localStorage';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};