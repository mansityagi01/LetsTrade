/* ==========================================================================
   Utility Functions - Formatters
   ========================================================================== */

/**
 * Format currency value with appropriate symbol
 * @param {number} value - Numeric value to format
 * @param {string} currencyCode - Currency code ('USD', 'INR')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currencyCode) {
    if (typeof value !== 'number' || isNaN(value)) {
        return currencyCode === 'USD' ? '$0.00' : '₹0.00';
    }
    
    const formattedValue = value.toFixed(2);
    
    if (currencyCode === 'INR') {
        return `₹${formattedValue}`;
    } else if (currencyCode === 'USD') {
        return `$${formattedValue}`;
    }
    
    // Fallback for unsupported currencies
    return `${formattedValue} ${currencyCode}`;
}

/**
 * Format percentage value with +/- sign
 * @param {number} value - Percentage value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0.00%';
    }
    
    const sign = value >= 0 ? '+' : '';
    const formattedValue = value.toFixed(decimals);
    
    return `${sign}${formattedValue}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatLargeNumber(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }
    
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`;
    }
    
    return value.toFixed(2);
}

/**
 * Format date and time
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
export function formatDateTime(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format quantity with appropriate precision
 * @param {number} quantity - Quantity value
 * @param {number} precision - Decimal places (default: 4)
 * @returns {string} Formatted quantity string
 */
export function formatQuantity(quantity, precision = 4) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
        return '0';
    }
    
    // For whole numbers, don't show decimals
    if (Number.isInteger(quantity)) {
        return quantity.toString();
    }
    
    return quantity.toFixed(precision);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    
    return `${text.substring(0, maxLength)}...`;
}
