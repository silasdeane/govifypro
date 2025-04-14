// File: src/utils/messageHistory.js

// History management functions
const MAX_HISTORY_ITEMS = 20;

// Save message to local storage
export const saveMessageToHistory = (message) => {
  try {
    // Get existing history
    const history = getMessageHistory();
    
    // Add new message with timestamp
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toISOString()
    };
    
    // Add to beginning (most recent first)
    history.unshift(messageWithTimestamp);
    
    // Limit to MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save back to local storage
    localStorage.setItem('nova_message_history', JSON.stringify(trimmedHistory));
    
    return true;
  } catch (error) {
    console.error('Error saving message to history:', error);
    return false;
  }
};

// Get message history from local storage
export const getMessageHistory = () => {
  try {
    const historyStr = localStorage.getItem('nova_message_history');
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (error) {
    console.error('Error getting message history:', error);
    return [];
  }
};

// Get previous questions asked by the user
export const getPreviousQuestions = () => {
  try {
    const history = getMessageHistory();
    // Filter for user messages only
    return history
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
  } catch (error) {
    console.error('Error getting previous questions:', error);
    return [];
  }
};

// Clear message history
export const clearMessageHistory = () => {
  try {
    localStorage.removeItem('nova_message_history');
    return true;
  } catch (error) {
    console.error('Error clearing message history:', error);
    return false;
  }
};