// This file centralizes communication with the chatbot backend.

const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'https://chatbot-python-backend-3.onrender.com';
const BASE_URL = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl;

export const sendMessageToBot = async (message) => {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    return { reply: `Connection Issue: ${error.message}` };
  }
};