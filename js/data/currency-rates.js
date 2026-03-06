/* ==========================================================================
   Currency Exchange Rates
   ========================================================================== */

/**
 * Real-time currency exchange rates for multi-currency portfolio calculations
 * Rates represent approximate values as of March 2026
 * Used to convert INR stock purchases/sales into USD portfolio balance
 */
export const EXCHANGE_RATES = {
    // Indian Rupee to US Dollar
    INR_TO_USD: 0.012,
    
    // US Dollar to Indian Rupee
    USD_TO_INR: 83.0,
    
    // Base currency for portfolio
    BASE_CURRENCY: 'USD'
};

/**
 * Convert INR to USD
 * @param {number} amountINR - Amount in Indian Rupees
 * @returns {number} Amount in US Dollars
 */
export function convertINRtoUSD(amountINR) {
    return amountINR * EXCHANGE_RATES.INR_TO_USD;
}

/**
 * Convert USD to INR
 * @param {number} amountUSD - Amount in US Dollars
 * @returns {number} Amount in Indian Rupees
 */
export function convertUSDtoINR(amountUSD) {
    return amountUSD * EXCHANGE_RATES.USD_TO_INR;
}

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency (INR or USD)
 * @param {string} toCurrency - Target currency (INR or USD)
 * @returns {number} Exchange rate
 */
export function getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return 1.0;
    }
    
    if (fromCurrency === 'INR' && toCurrency === 'USD') {
        return EXCHANGE_RATES.INR_TO_USD;
    }
    
    if (fromCurrency === 'USD' && toCurrency === 'INR') {
        return EXCHANGE_RATES.USD_TO_INR;
    }
    
    throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
}

/**
 * Convert any amount between supported currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
}

/**
 * Format currency with appropriate symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (USD, INR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency) {
    if (currency === 'USD') {
        return `$${amount.toFixed(2)}`;
    } else if (currency === 'INR') {
        return `₹${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)} ${currency}`;
}
