/* ==========================================================================
   Session Management - User Authentication State
   ========================================================================== */

import { getItem, setItem, removeItem } from '../utils/storage.js';
import { STORAGE_KEYS } from '../config.js';

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isLoggedIn() {
    const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
    return currentUser !== null && currentUser !== undefined;
}

/**
 * Get current logged-in user
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
    return getItem(STORAGE_KEYS.CURRENT_USER);
}

/**
 * Get current user's email
 * @returns {string|null} User email or null
 */
export function getCurrentUserEmail() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

/**
 * Create user session (login)
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export function createSession(user) {
    try {
        // Store current user
        const success = setItem(STORAGE_KEYS.CURRENT_USER, {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            loginTimestamp: new Date().toISOString()
        });
        
        if (success) {
            console.log('✓ Session created for:', user.email);
            
            // Dispatch login event
            document.dispatchEvent(new CustomEvent('userLogin', {
                detail: { user }
            }));
        }
        
        return success;
    } catch (error) {
        console.error('Error creating session:', error);
        return false;
    }
}

/**
 * Destroy user session (logout)
 * @returns {boolean} Success status
 */
export function destroySession() {
    try {
        const user = getCurrentUser();
        
        // Remove current user
        removeItem(STORAGE_KEYS.CURRENT_USER);
        
        console.log('✓ Session destroyed');
        
        // Dispatch logout event
        document.dispatchEvent(new CustomEvent('userLogout', {
            detail: { user }
        }));
        
        return true;
    } catch (error) {
        console.error('Error destroying session:', error);
        return false;
    }
}

/**
 * Clear all user data (logout + clear portfolio)
 * @returns {boolean} Success status
 */
export function clearUserData() {
    try {
        const userEmail = getCurrentUserEmail();
        
        // Remove session
        destroySession();
        
        // Remove portfolio for this user
        if (userEmail) {
            const portfolioKey = `${STORAGE_KEYS.PORTFOLIO}_${userEmail}`;
            removeItem(portfolioKey);
        }
        
        console.log('✓ User data cleared');
        return true;
    } catch (error) {
        console.error('Error clearing user data:', error);
        return false;
    }
}

/**
 * Require authentication (redirect if not logged in)
 * @param {string} redirectUrl - URL to redirect to if not logged in
 */
export function requireAuth(redirectUrl = 'index.html') {
    if (!isLoggedIn()) {
        console.warn('Authentication required. Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Get session duration (how long user has been logged in)
 * @returns {number} Duration in milliseconds
 */
export function getSessionDuration() {
    const user = getCurrentUser();
    
    if (!user || !user.loginTimestamp) {
        return 0;
    }
    
    const loginTime = new Date(user.loginTimestamp);
    const now = new Date();
    
    return now - loginTime;
}

/**
 * Refresh session timestamp
 * @returns {boolean} Success status
 */
export function refreshSession() {
    const user = getCurrentUser();
    
    if (!user) {
        return false;
    }
    
    user.loginTimestamp = new Date().toISOString();
    return setItem(STORAGE_KEYS.CURRENT_USER, user);
}

/**
 * Check if session is valid (not expired)
 * @param {number} maxDuration - Max session duration in milliseconds (default: 7 days)
 * @returns {boolean} True if session is valid
 */
export function isSessionValid(maxDuration = 7 * 24 * 60 * 60 * 1000) {
    if (!isLoggedIn()) {
        return false;
    }
    
    const duration = getSessionDuration();
    return duration > 0 && duration < maxDuration;
}
