/* ==========================================================================
   Login - User Authentication
   ========================================================================== */

import { getItem, setItem } from '../utils/storage.js';
import { createSession } from './session.js';
import { STORAGE_KEYS } from '../config.js';

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Result object
 */
export function loginUser(email, password) {
    try {
        // Validation
        if (!email || !password) {
            return {
                success: false,
                message: 'Please enter both email and password'
            };
        }
        
        // Get users from storage
        const users = getItem(STORAGE_KEYS.USERS, {});
        const normalizedEmail = email.toLowerCase().trim();
        
        // Check if user exists
        const user = users[normalizedEmail];
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
        // Verify password
        const hashedPassword = hashPassword(password);
        
        if (user.password !== hashedPassword) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        users[normalizedEmail] = user;
        setItem(STORAGE_KEYS.USERS, users);
        
        // Create session
        createSession(user);
        
        console.log(`✓ User logged in: ${user.email}`);
        
        return {
            success: true,
            message: 'Login successful! Redirecting to dashboard...',
            user: user
        };
        
    } catch (error) {
        console.error('Error during login:', error);
        return {
            success: false,
            message: 'Login failed. Please try again.'
        };
    }
}

/**
 * Simple password hashing (must match register.js)
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
function hashPassword(password) {
    // Simple hash for demo - must match register.js
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `simple_hash_${Math.abs(hash)}_${password.length}`;
}

/**
 * Initialize login form
 */
export function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (!loginForm) {
        console.warn('Login form not found');
        return;
    }
    
    loginForm.addEventListener('submit', handleLogin);
    console.log('✓ Login form initialized');
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    // Clear previous errors
    clearFormErrors();
    
    // Login user
    const result = loginUser(email, password);
    
    if (result.success) {
        // Show success message
        showFormMessage(result.message, 'success');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // Show error message
        showFormMessage(result.message, 'error');
    }
}

/**
 * Show form message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(message, type = 'info') {
    const messageContainer = document.getElementById('login-message');
    
    if (!messageContainer) {
        alert(message);
        return;
    }
    
    messageContainer.textContent = message;
    messageContainer.className = `form-message form-message--${type}`;
    messageContainer.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
}

/**
 * Clear form error messages
 */
function clearFormErrors() {
    const messageContainer = document.getElementById('login-message');
    
    if (messageContainer) {
        messageContainer.style.display = 'none';
        messageContainer.textContent = '';
    }
}

/**
 * Auto-fill demo credentials (for testing)
 */
export function fillDemoCredentials() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'demo@letstrade.com';
        passwordInput.value = 'demo123';
    }
}
