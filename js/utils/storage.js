/* ==========================================================================
   Storage Utilities - localStorage Abstraction Layer
   ========================================================================== */

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function getItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        
        if (item === null) {
            return defaultValue;
        }
        
        // Try to parse as JSON
        try {
            return JSON.parse(item);
        } catch (parseError) {
            // If parsing fails, return raw string
            return item;
        }
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function setItem(key, value) {
    try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
        
        // Check if quota exceeded
        if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded. Consider clearing old data.');
        }
        
        return false;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export function clear() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if key exists
 */
export function hasItem(key) {
    try {
        return localStorage.getItem(key) !== null;
    } catch (error) {
        console.error(`Error checking localStorage key (${key}):`, error);
        return false;
    }
}

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of keys
 */
export function getAllKeys() {
    try {
        return Object.keys(localStorage);
    } catch (error) {
        console.error('Error getting localStorage keys:', error);
        return [];
    }
}

/**
 * Get storage usage information
 * @returns {Object} Storage info
 */
export function getStorageInfo() {
    try {
        let totalSize = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            totalSize += key.length + (value ? value.length : 0);
        });
        
        return {
            keys: keys.length,
            size: totalSize,
            sizeKB: (totalSize / 1024).toFixed(2),
            available: true
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return {
            keys: 0,
            size: 0,
            sizeKB: 0,
            available: false
        };
    }
}

/**
 * Test if localStorage is available
 * @returns {boolean} True if available
 */
export function isStorageAvailable() {
    try {
        const testKey = '__letstrade_storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.warn('localStorage is not available:', error);
        return false;
    }
}
