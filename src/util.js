// Utility functions for application.

// Adds event listener to window, and returns function to remove listener.
export const registerListener = (eventName, handler) => {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}