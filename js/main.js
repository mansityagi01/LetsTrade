/* ==========================================================================
   Main Application Bootstrap - LetsTrade
   ========================================================================== */

import {
    APP_NAME,
    APP_VERSION,
    INITIAL_BALANCE,
    STORAGE_KEYS,
    PORTFOLIO_STATE_KEYS,
    MARKETS
} from './config.js';

import { isLoggedIn, getCurrentUser, requireAuth } from './auth/session.js';
import { getItem, setItem } from './utils/storage.js';
import { initializeDashboard as initDashboardController } from './ui/dashboard-controller.js';

// Global Application State
let portfolioState = null;
let userSession = null;

/* ==========================================================================
   Initialize Application
   ========================================================================== */

/**
 * Main application initialization function
 * Runs on DOMContentLoaded to bootstrap the app
 */
function initApp() {
    console.log(`%c${APP_NAME} v${APP_VERSION}`, 'color: #3b82f6; font-size: 18px; font-weight: bold;');
    console.log('%cPaper Trading Simulator Initializing...', 'color: #10b981; font-size: 14px;');
    
    // Get current page
    const pathname = window.location.pathname;
    const isDashboard = pathname.endsWith('dashboard.html');
    const isIndex = pathname.endsWith('index.html') || pathname === '/' || pathname.endsWith('/');
    
    // Check authentication status using new session module
    const loggedIn = isLoggedIn();
    
    // Route protection: Dashboard requires authentication
    if (isDashboard && !loggedIn) {
        console.warn('⚠ Unauthorized access to dashboard. Redirecting to login...');
        window.location.href = 'index.html';
        return;
    }
    
    // Redirect to dashboard if already logged in and on index
    if (isIndex && loggedIn) {
        console.log('✓ User already logged in. Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // If logged in, load user session and portfolio
    if (loggedIn) {
        userSession = getCurrentUser();
        
        if (userSession) {
            console.log('✓ User session found:', userSession.email);
            
            // Load portfolio for this user
            portfolioState = loadPortfolio(userSession.email);
            
            // Verify portfolio state and initialize if corrupted
            if (!portfolioState || !validatePortfolioStructure(portfolioState)) {
                console.warn('Portfolio state invalid. Reinitializing...');
                portfolioState = initializePortfolio(userSession.email, userSession.name);
                savePortfolio(portfolioState);
            }
            
            console.log('✓ Portfolio loaded successfully');
            console.log('LetsTrade Engine Initialized:', portfolioState);
        }
    } else {
        console.log('⚠ No active session. User needs to log in.');
        console.log('LetsTrade Engine Initialized: Ready for authentication');
    }
    
    // Initialize UI based on current page
    initializePageSpecificLogic();
}

/* ==========================================================================
   User Session Management (Legacy - Now handled by auth/session.js)
   ========================================================================== */

/**
 * Check if a user session exists in localStorage
 * @returns {Object|null} User session object or null
 * @deprecated Use isLoggedIn() and getCurrentUser() from auth/session.js
 */
function checkUserSession() {
    return isLoggedIn() ? getCurrentUser() : null;
}

/**
 * Create a new user session
 * @param {string} userId - Unique user identifier
 * @param {string} username - Username  
 * @param {string} email - User email
 * @returns {Object} Session object
 * @deprecated Use createSession() from auth/session.js
 */
function createUserSession(userId, username, email) {
    console.warn('createUserSession is deprecated. Use auth/session.js');
    return null;
}

/**
 * Clear user session (logout)
 * @deprecated Use destroySession() from auth/session.js
 */
function clearUserSession() {
    console.warn('clearUserSession is deprecated. Use auth/session.js');
}

/* ==========================================================================
   Portfolio Management
   ========================================================================== */

/**
 * Initialize a fresh portfolio for a new user
 * @param {string} userEmail - User email (used as identifier)
 * @param {string} username - Username
 * @returns {Object} Portfolio state object
 */
function initializePortfolio(userEmail, username) {
    const portfolio = {
        [PORTFOLIO_STATE_KEYS.USER_ID]: userEmail,
        [PORTFOLIO_STATE_KEYS.USERNAME]: username,
        [PORTFOLIO_STATE_KEYS.BALANCE]: INITIAL_BALANCE,
        [PORTFOLIO_STATE_KEYS.HOLDINGS]: [],
        transactionHistory: [],
        [PORTFOLIO_STATE_KEYS.TOTAL_VALUE]: INITIAL_BALANCE,
        [PORTFOLIO_STATE_KEYS.TOTAL_PNL]: 0,
        [PORTFOLIO_STATE_KEYS.TOTAL_PNL_PERCENTAGE]: 0,
        [PORTFOLIO_STATE_KEYS.INITIAL_BALANCE]: INITIAL_BALANCE,
        [PORTFOLIO_STATE_KEYS.CREATED_AT]: new Date().toISOString(),
        [PORTFOLIO_STATE_KEYS.LAST_UPDATED]: new Date().toISOString()
    };
    
    console.log(`✓ Portfolio initialized with $${INITIAL_BALANCE} USD`);
    return portfolio;
}

/**
 * Load portfolio from localStorage
 * @param {string} userEmail - User email (used as identifier)
 * @returns {Object|null} Portfolio state or null
 */
function loadPortfolio(userEmail) {
    try {
        // Portfolio is stored with user email as key suffix
        const portfolioKey = `${STORAGE_KEYS.PORTFOLIO}_${userEmail}`;
        const portfolio = getItem(portfolioKey);
        
        if (portfolio) {
            console.log(`✓ Portfolio loaded for ${userEmail}`);
            return portfolio;
        }
        
        console.log('No existing portfolio found. Will initialize new portfolio.');
        return null;
    } catch (error) {
        console.error('Error loading portfolio:', error);
        return null;
    }
}

/**
 * Save portfolio to localStorage
 * @param {Object} portfolio - Portfolio state object
 */
function savePortfolio(portfolio) {
    try {
        const userEmail = portfolio[PORTFOLIO_STATE_KEYS.USER_ID];
        if (!userEmail) {
            console.error('Cannot save portfolio: No user email found');
            return;
        }
        
        portfolio[PORTFOLIO_STATE_KEYS.LAST_UPDATED] = new Date().toISOString();
        
        // Save with user email as key suffix
        const portfolioKey = `${STORAGE_KEYS.PORTFOLIO}_${userEmail}`;
        setItem(portfolioKey, portfolio);
        
        console.log('✓ Portfolio saved to localStorage');
    } catch (error) {
        console.error('Error saving portfolio:', error);
    }
}

/**
 * Validate portfolio structure
 * @param {Object} portfolio - Portfolio object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validatePortfolioStructure(portfolio) {
    if (!portfolio) return false;
    
    const requiredKeys = [
        PORTFOLIO_STATE_KEYS.USER_ID,
        PORTFOLIO_STATE_KEYS.BALANCE,
        PORTFOLIO_STATE_KEYS.HOLDINGS,
        PORTFOLIO_STATE_KEYS.INITIAL_BALANCE
    ];
    
    return requiredKeys.every(key => portfolio.hasOwnProperty(key));
}

/**
 * Get current portfolio state
 * @returns {Object|null} Portfolio state
 */
export function getPortfolioState() {
    return portfolioState;
}

/**
 * Update portfolio state
 * @param {Object} updates - Object with keys to update
 */
export function updatePortfolioState(updates) {
    if (portfolioState) {
        portfolioState = { ...portfolioState, ...updates };
        savePortfolio(portfolioState);
        console.log('✓ Portfolio state updated');
    }
}

/* ==========================================================================
   Page-Specific Initialization
   ========================================================================== */

/**
 * Initialize logic based on current page
 */
function initializePageSpecificLogic() {
    const pathname = window.location.pathname;
    
    if (pathname.endsWith('dashboard.html')) {
        // Dashboard page - ensure user is logged in
        if (!userSession) {
            console.warn('Unauthorized access to dashboard. Redirecting to login...');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('✓ Dashboard page initialized');
        initializeDashboard();
        
    } else if (pathname.endsWith('index.html') || pathname === '/' || pathname.endsWith('/')) {
        // Authentication page
        console.log('✓ Authentication page initialized');
        initializeAuthPage();
    }
}

/**
 * Initialize dashboard-specific functionality
 */
function initializeDashboard() {
    // Update UI with portfolio data
    if (portfolioState) {
        updateDashboardUI();
    }
    
    // Set up event listeners for dashboard interactions
    setupDashboardEventListeners();
    
    // Initialize dashboard controller with market simulation
    initDashboardController();
}

/**
 * Update dashboard UI with current portfolio data
 */
function updateDashboardUI() {
    // Update balance display
    const balanceElement = document.getElementById('available-balance');
    if (balanceElement) {
        balanceElement.textContent = `$${portfolioState.balance.toFixed(2)}`;
    }
    
    // Update portfolio value
    const portfolioValueElement = document.getElementById('portfolio-value');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = `$${portfolioState.totalValue.toFixed(2)}`;
    }
    
    // Update P&L display
    const pnlElement = document.getElementById('total-pnl');
    if (pnlElement) {
        const pnl = portfolioState.totalPnL || 0;
        const pnlPercentage = portfolioState.totalPnLPercentage || 0;
        const sign = pnl >= 0 ? '+' : '';
        
        pnlElement.textContent = `${sign}$${pnl.toFixed(2)} (${sign}${pnlPercentage.toFixed(2)}%)`;
        pnlElement.className = `pnl-display__value ${pnl >= 0 ? 'pnl-display__value--positive' : 'pnl-display__value--negative'}`;
    }
    
    // Update username display
    const usernameElement = document.getElementById('username-display');
    if (usernameElement) {
        usernameElement.textContent = portfolioState.username || 'User';
    }
    
    console.log('✓ Dashboard UI updated with portfolio data');
}

/**
 * Set up dashboard event listeners
 */
function setupDashboardEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // User menu toggle
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    if (userMenuTrigger && userMenuDropdown) {
        userMenuTrigger.addEventListener('click', () => {
            userMenuDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuTrigger.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.remove('active');
            }
        });
    }
}

/**
 * Handle user logout
 */
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        clearUserSession();
        console.log('✓ User logged out');
        window.location.href = 'index.html';
    }
}

/**
 * Initialize authentication page
 */
function initializeAuthPage() {
    // Set up login/register form event listeners
    setupAuthEventListeners();
}

/**
 * Set up authentication page event listeners
 */
function setupAuthEventListeners() {
    // Tab switching between login and register
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('auth__tab--active');
            registerTab.classList.remove('auth__tab--active');
            if (loginForm) loginForm.classList.add('auth__form-container--active');
            if (registerForm) registerForm.classList.remove('auth__form-container--active');
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('auth__tab--active');
            loginTab.classList.remove('auth__tab--active');
            if (registerForm) registerForm.classList.add('auth__form-container--active');
            if (loginForm) loginForm.classList.remove('auth__form-container--active');
        });
    }
    
    // Switch links
    const switchLinks = document.querySelectorAll('.auth-form__link--switch');
    switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute('data-switch');
            if (targetTab === 'login' && loginTab) {
                loginTab.click();
            } else if (targetTab === 'register' && registerTab) {
                registerTab.click();
            }
        });
    });
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    initApp,
    checkUserSession,
    createUserSession,
    clearUserSession,
    initializePortfolio,
    loadPortfolio,
    savePortfolio,
    updateDashboardUI
};

/* ==========================================================================
   DOM Content Loaded Event Listener
   ========================================================================== */

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
