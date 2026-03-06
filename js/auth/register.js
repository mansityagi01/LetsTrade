/* ==========================================================================
   Registration - User Account Creation
   ========================================================================== */

import { getItem, setItem } from '../utils/storage.js';
import { createSession } from './session.js';
import { INITIAL_BALANCE, STORAGE_KEYS } from '../config.js';

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Result object
 */
export function registerUser(name, email, password) {
    try {
        // Validation
        if (!name || name.trim().length < 2) {
            return {
                success: false,
                message: 'Name must be at least 2 characters long'
            };
        }
        
        if (!email || !isValidEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }
        
        if (!password || password.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters long'
            };
        }
        
        // Check if user already exists
        const users = getItem(STORAGE_KEYS.USERS, {});
        
        if (users[email]) {
            return {
                success: false,
                message: 'An account with this email already exists'
            };
        }
        
        // Create user object
        const user = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword(password), // Simple hash (not production-ready)
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // Save user to users registry
        users[user.email] = user;
        setItem(STORAGE_KEYS.USERS, users);
        
        // Create initial portfolio with $10,000 starting balance
        const initialPortfolio = {
            balance: INITIAL_BALANCE,
            holdings: [],
            transactionHistory: [],
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Save initial portfolio for this user
        const portfolioKey = `${STORAGE_KEYS.PORTFOLIO}_${user.email}`;
        setItem(portfolioKey, initialPortfolio);
        
        console.log(`✓ User registered: ${user.email} with $${INITIAL_BALANCE} starting balance`);
        
        // Create session (auto-login)
        createSession(user);
        
        return {
            success: true,
            message: 'Registration successful! Redirecting to dashboard...',
            user: user
        };
        
    } catch (error) {
        console.error('Error during registration:', error);
        return {
            success: false,
            message: 'Registration failed. Please try again.'
        };
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Simple password hashing (NOT CRYPTOGRAPHICALLY SECURE - Demo purposes only)
 * In production, use bcrypt or similar
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
function hashPassword(password) {
    // Simple hash for demo - DO NOT USE IN PRODUCTION
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `simple_hash_${Math.abs(hash)}_${password.length}`;
}

/**
 * Initialize registration form
 */
export function initializeRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    
    if (!registerForm) {
        console.warn('Registration form not found');
        return;
    }
    
    registerForm.addEventListener('submit', handleRegistration);
    console.log('✓ Registration form initialized');
}

/**
 * Handle registration form submission
 * @param {Event} event - Form submit event
 */
function handleRegistration(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('register-username')?.value;
    const email = document.getElementById('register-email')?.value;
    const password = document.getElementById('register-password')?.value;
    
    // Clear previous errors
    clearFormErrors();
    
    // Register user
    const result = registerUser(name, email, password);
    
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
    const messageContainer = document.getElementById('register-message');
    
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
    const messageContainer = document.getElementById('register-message');
    
    if (messageContainer) {
        messageContainer.style.display = 'none';
        messageContainer.textContent = '';
    }
}
