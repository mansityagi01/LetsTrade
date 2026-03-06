/* ==========================================================================
   Trading Form Controller
   ========================================================================== */

import { executeTrade } from '../services/trade-executor.js';
import { getSelectedAsset } from './asset-renderer.js';
import marketSimulator from '../services/market-simulator.js';
import { showSuccess, showError } from '../utils/notification.js';
import { formatCurrency } from '../utils/formatters.js';

// Form elements
let tradingForm = null;
let quantityInput = null;
let executeButton = null;
let buyTab = null;
let sellTab = null;
let currentTradeType = 'BUY';

/* ==========================================================================
   Initialize Trading Form
   ========================================================================== */

/**
 * Initialize trading form event listeners
 */
export function initializeTradingForm() {
    // Get form elements
    tradingForm = document.getElementById('trading-form');
    quantityInput = document.getElementById('trade-quantity');
    executeButton = document.getElementById('execute-trade-btn');
    buyTab = document.querySelector('[data-trade-type="buy"]');
    sellTab = document.querySelector('[data-trade-type="sell"]');
    
    if (!tradingForm || !quantityInput || !executeButton) {
        console.warn('Trading form elements not found');
        return;
    }
    
    // Set up tab switching
    if (buyTab && sellTab) {
        buyTab.addEventListener('click', () => switchTradeType('BUY'));
        sellTab.addEventListener('click', () => switchTradeType('SELL'));
    }
    
    // Set up execute button
    executeButton.addEventListener('click', handleExecuteTrade);
    
    // Set up quantity input validation
    quantityInput.addEventListener('input', validateQuantityInput);
    
    // Set up increment/decrement buttons
    setupQuantityControls();
    
    console.log('✓ Trading form initialized');
}

/* ==========================================================================
   Trade Type Switching
   ========================================================================== */

/**
 * Switch between BUY and SELL tabs
 * @param {string} type - Trade type ('BUY' or 'SELL')
 */
function switchTradeType(type) {
    currentTradeType = type;
    
    // Update tab active state
    if (buyTab && sellTab) {
        if (type === 'BUY') {
            buyTab.classList.add('trade-tab--active');
            sellTab.classList.remove('trade-tab--active');
        } else {
            sellTab.classList.add('trade-tab--active');
            buyTab.classList.remove('trade-tab--active');
        }
    }
    
    // Update execute button text and style
    if (executeButton) {
        executeButton.textContent = type === 'BUY' ? 'Execute Buy Order' : 'Execute Sell Order';
        executeButton.className = type === 'BUY' 
            ? 'trading-form__submit trading-form__submit--buy'
            : 'trading-form__submit trading-form__submit--sell';
    }
    
    console.log(`✓ Switched to ${type} mode`);
}

/* ==========================================================================
   Execute Trade Handler
   ========================================================================== */

/**
 * Handle execute trade button click
 */
async function handleExecuteTrade(e) {
    e.preventDefault();
    
    // Get selected asset
    const selectedAsset = getSelectedAsset();
    
    if (!selectedAsset) {
        showError('Please select an asset from the watchlist');
        return;
    }
    
    // Get quantity
    const quantity = parseFloat(quantityInput.value);
    
    if (!quantity || quantity <= 0) {
        showError('Please enter a valid quantity');
        return;
    }
    
    // Get current price from market simulator
    const asset = marketSimulator.getAssetBySymbol(selectedAsset.symbol);
    
    if (!asset) {
        showError('Asset not found in market data');
        return;
    }
    
    const currentPrice = asset.currentPrice;
    
    // Disable button during execution
    executeButton.disabled = true;
    executeButton.textContent = 'Processing...';
    
    try {
        // Execute the trade
        const result = executeTrade(currentTradeType, asset, quantity, currentPrice);
        
        if (result.success) {
            // Show success notification
            const priceFormatted = formatCurrency(currentPrice, asset.currency);
            const totalFormatted = formatCurrency(result.transaction.totalCostUSD || result.transaction.totalValueUSD, 'USD');
            
            const message = currentTradeType === 'BUY'
                ? `Successfully bought ${quantity} ${asset.symbol} at ${priceFormatted} (Total: ${totalFormatted})`
                : `Successfully sold ${quantity} ${asset.symbol} at ${priceFormatted} (Total: ${totalFormatted})`;
            
            showSuccess(message);
            
            // Reset form
            resetTradingForm();
            
            // Dispatch portfolio update event
            document.dispatchEvent(new CustomEvent('portfolioUpdate', {
                detail: {
                    newBalance: result.newBalance,
                    transaction: result.transaction
                }
            }));
            
            console.log('✓ Trade executed successfully:', result);
        }
    } catch (error) {
        // Show error notification
        showError(error.message || 'Trade execution failed');
        console.error('Trade execution error:', error);
    } finally {
        // Re-enable button
        executeButton.disabled = false;
        executeButton.textContent = currentTradeType === 'BUY' ? 'Execute Buy Order' : 'Execute Sell Order';
    }
}

/* ==========================================================================
   Form Validation & Controls
   ========================================================================== */

/**
 * Validate quantity input
 */
function validateQuantityInput() {
    const value = quantityInput.value;
    
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        quantityInput.value = parts[0] + '.' + parts.slice(1).join('');
        return;
    }
    
    quantityInput.value = cleaned;
}

/**
 * Set up quantity increment/decrement controls
 */
function setupQuantityControls() {
    const incrementBtn = document.getElementById('quantity-increment');
    const decrementBtn = document.getElementById('quantity-decrement');
    
    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            const current = parseFloat(quantityInput.value) || 0;
            quantityInput.value = current + 1;
        });
    }
    
    if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
            const current = parseFloat(quantityInput.value) || 0;
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }
}

/**
 * Reset trading form to default state
 */
function resetTradingForm() {
    if (quantityInput) {
        quantityInput.value = '1';
    }
    
    // Clear selected asset highlight
    document.querySelectorAll('.asset-item').forEach(item => {
        item.classList.remove('asset-item--active');
    });
    
    // Reset to BUY mode
    switchTradeType('BUY');
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    switchTradeType,
    resetTradingForm
};
