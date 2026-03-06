/* ==========================================================================
   Trade Executor - Core Trading Logic
   ========================================================================== */

import { EXCHANGE_RATES } from '../data/currency-rates.js';
import { 
    TRANSACTION_TYPES, 
    ORDER_STATUS, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES 
} from '../config.js';
import { getPortfolioState, updatePortfolioState } from '../main.js';

/* ==========================================================================
   Execute Trade Function
   ========================================================================== */

/**
 * Execute a trade (BUY or SELL)
 * @param {string} type - Transaction type ('BUY' or 'SELL')
 * @param {Object} asset - Asset object with symbol, name, currency, etc.
 * @param {number} quantity - Number of shares/units to trade
 * @param {number} currentPrice - Current price per unit
 * @returns {Object} Transaction result
 */
export function executeTrade(type, asset, quantity, currentPrice) {
    // Validate inputs
    if (!type || !asset || !quantity || !currentPrice) {
        throw new Error(ERROR_MESSAGES.INVALID_TRADE_DATA);
    }
    
    if (quantity <= 0) {
        throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    
    if (currentPrice <= 0) {
        throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    
    // Get current portfolio state
    const portfolio = getPortfolioState();
    
    if (!portfolio) {
        throw new Error('Portfolio not initialized');
    }
    
    // Calculate total cost in USD
    const totalCostInUSD = calculateTotalCostUSD(asset.currency, currentPrice, quantity);
    
    // Execute buy or sell
    if (type === TRANSACTION_TYPES.BUY) {
        return executeBuy(portfolio, asset, quantity, currentPrice, totalCostInUSD);
    } else if (type === TRANSACTION_TYPES.SELL) {
        return executeSell(portfolio, asset, quantity, currentPrice, totalCostInUSD);
    } else {
        throw new Error(`Invalid transaction type: ${type}`);
    }
}

/* ==========================================================================
   Calculate Total Cost in USD
   ========================================================================== */

/**
 * Calculate total cost in USD, converting from INR if necessary
 * @param {string} currency - Asset currency ('USD' or 'INR')
 * @param {number} price - Price per unit
 * @param {number} quantity - Quantity to trade
 * @returns {number} Total cost in USD
 */
function calculateTotalCostUSD(currency, price, quantity) {
    let priceInUSD = price;
    
    // Convert INR to USD if necessary
    if (currency === 'INR') {
        priceInUSD = price * EXCHANGE_RATES.INR_TO_USD;
    }
    
    const totalCostInUSD = priceInUSD * quantity;
    
    return totalCostInUSD;
}

/* ==========================================================================
   Execute Buy Order
   ========================================================================== */

/**
 * Execute a BUY order
 * @param {Object} portfolio - Current portfolio state
 * @param {Object} asset - Asset to buy
 * @param {number} quantity - Quantity to buy
 * @param {number} currentPrice - Current price
 * @param {number} totalCostInUSD - Total cost in USD
 * @returns {Object} Transaction result
 */
function executeBuy(portfolio, asset, quantity, currentPrice, totalCostInUSD) {
    // Validation: Check if user has sufficient balance
    if (totalCostInUSD > portfolio.balance) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
    }
    
    // Deduct from balance
    const newBalance = portfolio.balance - totalCostInUSD;
    
    // Update or add holding
    const holdings = [...portfolio.holdings];
    const existingHoldingIndex = holdings.findIndex(h => h.symbol === asset.symbol);
    
    if (existingHoldingIndex >= 0) {
        // Update existing holding
        const existingHolding = holdings[existingHoldingIndex];
        const totalQuantity = existingHolding.quantity + quantity;
        const totalCost = (existingHolding.averageCost * existingHolding.quantity) + (currentPrice * quantity);
        const averageCost = totalCost / totalQuantity;
        
        holdings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: totalQuantity,
            averageCost: averageCost,
            lastUpdated: new Date().toISOString()
        };
    } else {
        // Add new holding
        holdings.push({
            symbol: asset.symbol,
            name: asset.name,
            sector: asset.sector,
            currency: asset.currency,
            quantity: quantity,
            averageCost: currentPrice,
            currentPrice: currentPrice,
            totalValue: totalCostInUSD,
            unrealizedPnL: 0,
            unrealizedPnLPercentage: 0,
            addedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });
    }
    
    // Create transaction record
    const transaction = {
        id: generateTransactionId(),
        type: TRANSACTION_TYPES.BUY,
        symbol: asset.symbol,
        name: asset.name,
        currency: asset.currency,
        quantity: quantity,
        executionPrice: currentPrice,
        totalCostUSD: totalCostInUSD,
        totalValue: totalCostInUSD,
        realizedPnL: null,
        timestamp: new Date().toISOString(),
        status: ORDER_STATUS.COMPLETED
    };
    
    // Update portfolio state
    updatePortfolioState({
        balance: newBalance,
        holdings: holdings
    });
    
    // Save transaction to history
    saveTransaction(transaction);
    saveTransactionToPortfolio(transaction);
    
    console.log(`✓ BUY order executed: ${quantity} ${asset.symbol} at ${asset.currency === 'INR' ? '₹' : '$'}${currentPrice}`);
    
    return {
        success: true,
        message: SUCCESS_MESSAGES.TRADE_EXECUTED,
        transaction: transaction,
        newBalance: newBalance
    };
}

/* ==========================================================================
   Execute Sell Order
   ========================================================================== */

/**
 * Execute a SELL order
 * @param {Object} portfolio - Current portfolio state
 * @param {Object} asset - Asset to sell
 * @param {number} quantity - Quantity to sell
 * @param {number} currentPrice - Current price
 * @param {number} totalCostInUSD - Total value in USD
 * @returns {Object} Transaction result
 */
function executeSell(portfolio, asset, quantity, currentPrice, totalCostInUSD) {
    // Validation: Check if user has sufficient holdings
    const holdings = [...portfolio.holdings];
    const existingHoldingIndex = holdings.findIndex(h => h.symbol === asset.symbol);
    
    if (existingHoldingIndex < 0) {
        throw new Error(ERROR_MESSAGES.ASSET_NOT_FOUND);
    }
    
    const existingHolding = holdings[existingHoldingIndex];
    
    if (quantity > existingHolding.quantity) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_HOLDINGS);
    }
    
    // Calculate realized P&L
    // Realized P&L = (executionPrice - averageCost) * quantity
    const costBasisLocal = existingHolding.averageCost * quantity;
    const saleValueLocal = currentPrice * quantity;
    const realizedPnLLocal = saleValueLocal - costBasisLocal;
    
    // Convert to USD if INR
    let realizedPnLUSD = realizedPnLLocal;
    if (asset.currency === 'INR') {
        realizedPnLUSD = realizedPnLLocal * EXCHANGE_RATES.INR_TO_USD;
    }
    
    // Add to balance
    const newBalance = portfolio.balance + totalCostInUSD;
    
    // Update or remove holding
    if (quantity === existingHolding.quantity) {
        // Remove holding entirely
        holdings.splice(existingHoldingIndex, 1);
    } else {
        // Reduce quantity
        holdings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: existingHolding.quantity - quantity,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Create transaction record
    const transaction = {
        id: generateTransactionId(),
        type: TRANSACTION_TYPES.SELL,
        symbol: asset.symbol,
        name: asset.name,
        currency: asset.currency,
        quantity: quantity,
        executionPrice: currentPrice,
        totalValueUSD: totalCostInUSD,
        totalValue: totalCostInUSD,
        realizedPnL: realizedPnLUSD,
        timestamp: new Date().toISOString(),
        status: ORDER_STATUS.COMPLETED
    };
    
    // Update portfolio state
    updatePortfolioState({
        balance: newBalance,
        holdings: holdings
    });
    
    // Save transaction to history
    saveTransaction(transaction);
    saveTransactionToPortfolio(transaction);
    
    console.log(`✓ SELL order executed: ${quantity} ${asset.symbol} at ${asset.currency === 'INR' ? '₹' : '$'}${currentPrice}`);
    
    return {
        success: true,
        message: SUCCESS_MESSAGES.TRADE_EXECUTED,
        transaction: transaction,
        newBalance: newBalance,
        realizedPnL: realizedPnLUSD
    };
}

/* ==========================================================================
   Transaction Management
   ========================================================================== */

/**
 * Generate unique transaction ID
 * @returns {string} Transaction ID
 */
function generateTransactionId() {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save transaction to localStorage history
 * @param {Object} transaction - Transaction object
 */
function saveTransaction(transaction) {
    try {
        const historyKey = 'letstrade_transaction_history';
        const existingHistory = localStorage.getItem(historyKey);
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        
        history.unshift(transaction); // Add to beginning
        
        // Keep only last 100 transactions
        if (history.length > 100) {
            history.splice(100);
 

/**
 * Save transaction to portfolio state
 * @param {Object} transaction - Transaction object
 */
function saveTransactionToPortfolio(transaction) {
    try {
        const portfolio = getPortfolioState();
        if (!portfolio) return;
        
        const transactionHistory = portfolio.transactionHistory || [];
        transactionHistory.unshift(transaction);
        
        // Keep only last 100 in portfolio
        if (transactionHistory.length > 100) {
            transactionHistory.splice(100);
        }
        
        updatePortfolioState({
            transactionHistory: transactionHistory
        });
    } catch (error) {
        console.error('Error saving transaction to portfolio:', error);
    }
}       }
        
        localStorage.setItem(historyKey, JSON.stringify(history));
        console.log('✓ Transaction saved to history');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

/**
 * Get transaction history
 * @returns {Array} Array of transactions
 */
export function getTransactionHistory() {
    try {
        const historyKey = 'letstrade_transaction_history';
        const existingHistory = localStorage.getItem(historyKey);
        return existingHistory ? JSON.parse(existingHistory) : [];
    } catch (error) {
        console.error('Error loading transaction history:', error);
        return [];
    }
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    calculateTotalCostUSD
};
