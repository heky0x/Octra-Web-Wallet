// Chrome extension storage utilities
export class ExtensionStorage {
  static async setItem(key: string, value: any): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [key]: value });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static async getItem(key: string): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get([key]);
      return result[key];
    } else {
      // Fallback to localStorage for development
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove([key]);
    } else {
      // Fallback to localStorage for development
      localStorage.removeItem(key);
    }
  }

  static async clear(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.clear();
    } else {
      // Fallback to localStorage for development
      localStorage.clear();
    }
  }
}