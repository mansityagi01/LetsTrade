/* ==========================================================================
   UI Asset Renderer - Watchlist Display Engine
   ========================================================================== */

import { indianStocks } from '../data/indian-stocks.js';
import { usStocks } from '../data/us-stocks.js';
import { cryptocurrencies } from '../data/cryptocurrencies.js';
import { formatCurrency, formatPercent } from '../utils/formatters.js';

// Currently active asset for trading
let selectedAsset = null;

/* ==========================================================================
   Render Asset List
   ========================================================================== */

/**
 * Render asset list into specified container
 * @param {Array} assetArray - Array of asset objects
 * @param {string} containerId - DOM element ID to render into
 */
export function renderAssetList(assetArray, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Render each asset
    assetArray.forEach(asset => {
        const assetElement = createAssetElement(asset);
        container.appendChild(assetElement);
        
        // Add click event listener
        assetElement.addEventListener('click', () => handleAssetClick(asset));
    });
    
    console.log(`✓ Rendered ${assetArray.length} assets to ${containerId}`);
}

/**
 * Create DOM element for a single asset
 * @param {Object} asset - Asset object
 * @returns {HTMLElement} Asset list item element
 */
function createAssetElement(asset) {
    // Generate random price change for simulation (-5% to +5%)
    const priceChange = (Math.random() * 10 - 5);
    const changeClass = priceChange >= 0 ? 'asset-item__change--positive' : 'asset-item__change--negative';
    
    // Create asset item element
    const assetItem = document.createElement('div');
    assetItem.className = 'asset-item';
    assetItem.dataset.symbol = asset.symbol;
    assetItem.dataset.currency = asset.currency;
    
    // Build HTML structure using template literal
    assetItem.innerHTML = `
        <div class="asset-item__info">
            <div class="asset-item__symbol">${asset.symbol}</div>
            <div class="asset-item__name">${truncateName(asset.name)}</div>
        </div>
        <div class="asset-item__price-info">
            <div class="asset-item__price">${formatCurrency(asset.basePrice, asset.currency)}</div>
            <div class="asset-item__change ${changeClass}">${formatPercent(priceChange)}</div>
        </div>
    `;
    
    return assetItem;
}

/**
 * Truncate asset name if too long
 * @param {string} name - Asset name
 * @returns {string} Truncated name
 */
function truncateName(name) {
    const maxLength = 20;
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
}

/**
 * Handle asset click event
 * @param {Object} asset - Clicked asset object
 */
function handleAssetClick(asset) {
    selectedAsset = asset;
    
    // Remove active class from all asset items
    document.querySelectorAll('.asset-item').forEach(item => {
        item.classList.remove('asset-item--active');
    });
    
    // Add active class to clicked item
    const clickedElement = document.querySelector(`[data-symbol="${asset.symbol}"]`);
    if (clickedElement) {
        clickedElement.classList.add('asset-item--active');
    }
    
    // Populate trading panel with selected asset
    populateTradingPanel(asset);
    
    console.log(`✓ Asset selected: ${asset.symbol} - ${asset.name}`);
}

/**
 * Populate trading panel with selected asset details
 * @param {Object} asset - Asset object
 */
function populateTradingPanel(asset) {
    // Update asset symbol in trading panel header
    const tradingSymbol = document.getElementById('trading-symbol');
    if (tradingSymbol) {
        tradingSymbol.textContent = asset.symbol;
    }
    
    // Update asset name in trading panel header
    const tradingName = document.getElementById('trading-name');
    if (tradingName) {
        tradingName.textContent = asset.name;
    }
    
    // Update current price display
    const tradingPrice = document.getElementById('trading-price');
    if (tradingPrice) {
        tradingPrice.textContent = formatCurrency(asset.basePrice, asset.currency);
    }
    
    // Store asset data in trading form for later use
    const tradingForm = document.getElementById('trading-form');
    if (tradingForm) {
        tradingForm.dataset.symbol = asset.symbol;
        tradingForm.dataset.name = asset.name;
        tradingForm.dataset.price = asset.basePrice;
        tradingForm.dataset.currency = asset.currency;
        tradingForm.dataset.sector = asset.sector;
    }
    
    // Reset quantity input
    const quantityInput = document.getElementById('trade-quantity');
    if (quantityInput) {
        quantityInput.value = '1';
    }
    
    // Update order preview
    updateOrderPreview(asset.basePrice, 1, asset.currency);
}

/**
 * Update order preview calculation
 * @param {number} price - Asset price
 * @param {number} quantity - Order quantity
 * @param {string} currency - Currency code
 */
function updateOrderPreview(price, quantity, currency) {
    const total = price * quantity;
    
    const orderTotal = document.getElementById('order-total');
    if (orderTotal) {
        orderTotal.textContent = formatCurrency(total, currency);
    }
}

/**
 * Get currently selected asset
 * @returns {Object|null} Selected asset or null
 */
export function getSelectedAsset() {
    return selectedAsset;
}

/* ==========================================================================
   Tab Switching Logic
   ========================================================================== */

/**
 * Initialize asset list tabs and event listeners
 */
export function initializeAssetTabs() {
    // Get tab elements
    const indianStocksTab = document.querySelector('[data-market="indian-stocks"]');
    const usStocksTab = document.querySelector('[data-market="us-stocks"]');
    const cryptoTab = document.querySelector('[data-market="crypto"]');
    
    // Get asset list container
    const assetListContainer = 'asset-list-container';
    
    if (!indianStocksTab || !usStocksTab || !cryptoTab) {
        console.warn('Market tabs not found. Tab switching disabled.');
        return;
    }
    
    // Attach click event listeners
    indianStocksTab.addEventListener('click', () => {
        switchMarketTab('indian-stocks', indianStocksTab, assetListContainer);
    });
    
    usStocksTab.addEventListener('click', () => {
        switchMarketTab('us-stocks', usStocksTab, assetListContainer);
    });
    
    cryptoTab.addEventListener('click', () => {
        switchMarketTab('crypto', cryptoTab, assetListContainer);
    });
    
    // Load initial market (Indian Stocks by default)
    switchMarketTab('indian-stocks', indianStocksTab, assetListContainer);
    
    console.log('✓ Asset tabs initialized');
}

/**
 * Switch active market tab and render corresponding assets
 * @param {string} marketType - Market type identifier
 * @param {HTMLElement} activeTab - Active tab element
 * @param {string} containerId - Container ID to render assets
 */
function switchMarketTab(marketType, activeTab, containerId) {
    // Remove active class from all tabs
    document.querySelectorAll('[data-market]').forEach(tab => {
        tab.classList.remove('market-tab--active');
    });
    
    // Add active class to clicked tab
    activeTab.classList.add('market-tab--active');
    
    // Render appropriate asset list
    switch (marketType) {
        case 'indian-stocks':
            renderAssetList(indianStocks, containerId);
            console.log('✓ Switched to Indian Stocks market');
            break;
        case 'us-stocks':
            renderAssetList(usStocks, containerId);
            console.log('✓ Switched to US Stocks market');
            break;
        case 'crypto':
            renderAssetList(cryptocurrencies, containerId);
            console.log('✓ Switched to Crypto market');
            break;
        default:
            console.error(`Unknown market type: ${marketType}`);
    }
    
    // Clear selected asset when switching tabs
    selectedAsset = null;
    clearTradingPanel();
}

/**
 * Clear trading panel when switching markets
 */
function clearTradingPanel() {
    const tradingSymbol = document.getElementById('trading-symbol');
    const tradingName = document.getElementById('trading-name');
    const tradingPrice = document.getElementById('trading-price');
    
    if (tradingSymbol) tradingSymbol.textContent = 'Select an asset';
    if (tradingName) tradingName.textContent = '';
    if (tradingPrice) tradingPrice.textContent = '$0.00';
    
    // Remove all active classes from asset items
    document.querySelectorAll('.asset-item').forEach(item => {
        item.classList.remove('asset-item--active');
    });
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    handleAssetClick,
    populateTradingPanel,
    updateOrderPreview
};
