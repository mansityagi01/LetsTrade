/* ==========================================================================
   Global Configuration - LetsTrade Paper Trading Simulator
   ========================================================================== */

// Core Application Constants
export const APP_NAME = 'LetsTrade';
export const APP_VERSION = '1.0.0';

// Financial Configuration
export const INITIAL_BALANCE = 10000; // Starting virtual USD balance for all users
export const MIN_TRADE_AMOUNT = 0.001; // Minimum quantity for any trade
export const MAX_TRADE_AMOUNT = 1000000; // Maximum quantity for single trade

// Currency Configuration
export const CURRENCIES = {
    USD: 'USD',
    INR: 'INR'
};

// Currency Conversion Rates (Mock - simulated exchange rate)
export const EXCHANGE_RATES = {
    INR_TO_USD: 0.012, // 1 INR = 0.012 USD (approximately 1 USD = 83 INR)
    USD_TO_INR: 83.0   // 1 USD = 83 INR
};

// Market Definitions
export const MARKETS = {
    INDIAN_STOCKS: {
        id: 'indian-stocks',
        name: 'Indian Stocks',
        label: 'Indian Stocks',
        currency: CURRENCIES.INR,
        icon: '🇮🇳',
        color: '#f59e0b', // Amber
        volatility: 0.02 // 2% volatility factor
    },
    US_STOCKS: {
        id: 'us-stocks',
        name: 'US Stocks',
        label: 'US Stocks',
        currency: CURRENCIES.USD,
        icon: '🇺🇸',
        color: '#3b82f6', // Blue
        volatility: 0.015 // 1.5% volatility factor
    },
    CRYPTO: {
        id: 'crypto',
        name: 'Cryptocurrencies',
        label: 'Crypto',
        currency: CURRENCIES.USD,
        icon: '₿',
        color: '#8b5cf6', // Purple
        volatility: 0.05 // 5% volatility factor (higher for crypto)
    }
};

// Market Simulation Configuration
export const SIMULATION_CONFIG = {
    UPDATE_INTERVAL: 3000, // Price update interval in milliseconds (3 seconds)
    PRICE_DECIMAL_PLACES: 2, // Decimal places for price display
    PERCENTAGE_DECIMAL_PLACES: 2, // Decimal places for percentage display
    ENABLE_RANDOM_WALK: true, // Enable random walk price simulation
    PRICE_BOUNDS: {
        MIN_MULTIPLIER: 0.5, // Minimum price = initialPrice * 0.5
        MAX_MULTIPLIER: 3.0  // Maximum price = initialPrice * 3.0
    }
};

// LocalStorage Keys
export const STORAGE_KEYS = {
    USER_SESSION: 'letsTrade_userSession',
    PORTFOLIO: 'letsTrade_portfolio',
    TRANSACTION_HISTORY: 'letsTrade_transactions',
    USER_PREFERENCES: 'letsTrade_preferences',
    MARKET_PRICES: 'letsTrade_marketPrices'
};

// Transaction Types
export const TRANSACTION_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL'
};

// Order Status
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    EXECUTED: 'EXECUTED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};

// Portfolio State Keys
export const PORTFOLIO_STATE_KEYS = {
    USER_ID: 'userId',
    USERNAME: 'username',
    BALANCE: 'balance',
    HOLDINGS: 'holdings',
    TOTAL_VALUE: 'totalValue',
    TOTAL_PNL: 'totalPnL',
    TOTAL_PNL_PERCENTAGE: 'totalPnLPercentage',
    INITIAL_BALANCE: 'initialBalance',
    CREATED_AT: 'createdAt',
    LAST_UPDATED: 'lastUpdated'
};

// Chart Configuration
export const CHART_CONFIG = {
    TIMEFRAMES: {
        ONE_DAY: { label: '1D', value: '1D', dataPoints: 24 },
        ONE_WEEK: { label: '1W', value: '1W', dataPoints: 7 },
        ONE_MONTH: { label: '1M', value: '1M', dataPoints: 30 },
        THREE_MONTHS: { label: '3M', value: '3M', dataPoints: 90 },
        ALL: { label: 'ALL', value: 'ALL', dataPoints: 365 }
    },
    DEFAULT_TIMEFRAME: '1D',
    ANIMATION_DURATION: 300
};

// UI Configuration
export const UI_CONFIG = {
    NOTIFICATION_DURATION: 3000, // Toast notification duration (ms)
    DEBOUNCE_DELAY: 300, // Input debounce delay (ms)
    ANIMATION_DELAY: 150 // UI animation delay (ms)
};

// Validation Rules
export const VALIDATION_RULES = {
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,
    MIN_PASSWORD_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME_REGEX: /^[a-zA-Z0-9_]+$/
};

// Error Messages
export const ERROR_MESSAGES = {
    INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction',
    INSUFFICIENT_HOLDINGS: 'You do not own enough of this asset to sell',
    INVALID_QUANTITY: 'Please enter a valid quantity',
    INVALID_ASSET: 'Invalid asset selected',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    NETWORK_ERROR: 'Network error. Please try again.',
    INVALID_CREDENTIALS: 'Invalid username or password',
    USERNAME_EXISTS: 'Username already exists',
    GENERIC_ERROR: 'An error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    TRADE_EXECUTED: 'Trade executed successfully!',
    REGISTRATION_SUCCESS: 'Account created successfully!',
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'Logged out successfully'
};

// Asset Categories (for filtering)
export const ASSET_CATEGORIES = {
    ALL: 'all',
    STOCKS: 'stocks',
    CRYPTO: 'crypto'
};

// Default User Preferences
export const DEFAULT_PREFERENCES = {
    theme: 'dark',
    chartType: 'line',
    defaultTimeframe: '1D',
    showNotifications: true,
    autoRefresh: true
};

// Feature Flags
export const FEATURE_FLAGS = {
    ENABLE_FRACTIONAL_TRADING: true,
    ENABLE_LIMIT_ORDERS: false, // Future feature
    ENABLE_STOP_LOSS: false, // Future feature
    ENABLE_LEADERBOARD: false, // Future feature
    ENABLE_SOCIAL_FEATURES: false // Future feature
};

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
    BASE_URL: '', // To be configured when backend is added
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout'
    },
    PORTFOLIO: {
        GET: '/portfolio',
        UPDATE: '/portfolio/update'
    },
    TRADES: {
        EXECUTE: '/trades/execute',
        HISTORY: '/trades/history'
    },
    MARKET: {
        PRICES: '/market/prices',
        ASSETS: '/market/assets'
    }
};

export default {
    APP_NAME,
    APP_VERSION,
    INITIAL_BALANCE,
    CURRENCIES,
    EXCHANGE_RATES,
    MARKETS,
    SIMULATION_CONFIG,
    STORAGE_KEYS,
    TRANSACTION_TYPES,
    ORDER_STATUS,
    PORTFOLIO_STATE_KEYS,
    CHART_CONFIG,
    UI_CONFIG,
    VALIDATION_RULES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ASSET_CATEGORIES,
    DEFAULT_PREFERENCES,
    FEATURE_FLAGS,
    API_ENDPOINTS
};
