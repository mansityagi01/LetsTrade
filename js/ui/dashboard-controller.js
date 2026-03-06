/* ==========================================================================
   Dashboard Controller - Main UI Orchestrator
   ========================================================================== */

import marketSimulator from '../services/market-simulator.js';
import { initializeAssetTabs, renderAssetList } from './asset-renderer.js';
import { initializeTradingForm } from './trading-form.js';
import { refreshPortfolioDisplay } from './portfolio-display.js';
import { initializeTransactionHistory } from './transaction-history.js';
import { calculatePortfolioPnL } from '../services/pnl-calculator.js';
import { initializePortfolioChart, updatePortfolioChart } from '../charts/portfolio-chart.js';
import { initializeAllocationChart, updateAllocationChart } from '../charts/allocation-chart.js';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import { getPortfolioState } from '../main.js';

// Current active market
let currentMarket = 'indian-stocks';
let currentAssets = [];

/* ==========================================================================
   Initialize Dashboard
   ========================================================================== */

/**
 * Initialize dashboard functionality
 */
export function initializeDashboard() {
    console.log('✓ Initializing dashboard controller');
    
    // Initialize asset tabs
    initializeAssetTabs();
    
    // Initialize trading form
    initializeTradingForm();
    
    // Initialize transaction history
    initializeTransactionHistory();
    
    // Initialize charts
    const portfolio = getPortfolioState();
    const initialBalance = portfolio ? portfolio.balance : 10000;
    initializePortfolioChart('portfolio-chart', initialBalance);
    initializeAllocationChart('allocation-chart');
    
    // Set up market update listener
    setupMarketUpdateListener();
    
    // Set up portfolio update listener
    setupPortfolioUpdateListener();
    
    // Start market simulation
    marketSimulator.startSimulation();
    
    // Initial portfolio display refresh
    const initialMarketData = marketSimulator.getMarketData();
    const liveMarketData = {
        indianStocks: initialMarketData.indianStocks,
        usStocks: initialMarketData.usStocks,
        cryptocurrencies: initialMarketData.cryptocurrencies
    };
    refreshPortfolioDisplay(liveMarketData);
    
    // Initial chart data update
    if (portfolio) {
        const pnlData = calculatePortfolioPnL(portfolio, liveMarketData);
        updatePortfolioChart(pnlData.totalValue);
        updateAllocationChart(portfolio, pnlData);
    }
    
    // Track current market
    trackCurrentMarket();
    
    console.log('✓ Dashboard controller ready');
}

/* ==========================================================================
   Market Update Event Listener
   ========================================================================== */

/**
 * Set up listener for market update events
 */
function setupMarketUpdateListener() {
    document.addEventListener('marketUpdate', (event) => {
        const { indianStocks, usStocks, cryptocurrencies, timestamp } = event.detail;
        
        // Store all assets
        const allMarkets = {
            'indian-stocks': indianStocks,
            'us-stocks': usStocks,
            'crypto': cryptocurrencies
        };
        
        // Update current assets
        currentAssets = allMarkets[currentMarket];
        
        // Re-render the visible watchlist
        updateVisibleWatchlist(currentAssets);
        
        // Refresh portfolio display with live P&L calculations
        const liveMarketData = {
            indianStocks,
            usStocks,
            cryptocurrencies
        };
        refreshPortfolioDisplay(liveMarketData);
        
        // Update charts with live data
        const portfolio = getPortfolioState();
        if (portfolio) {
            const pnlData = calculatePortfolioPnL(portfolio, liveMarketData);
            updatePortfolioChart(pnlData.totalValue);
            updateAllocationChart(portfolio, pnlData);
        }
        
        // Log update (can be removed in production)
        // console.log(`Market updated at ${timestamp}`);
    });
    
    console.log('✓ Market update listener registered');
}

/**
 * Update the visible watchlist with new prices
 * @param {Array} assets - Updated asset array
 */
function updateVisibleWatchlist(assets) {
    const container = document.getElementById('asset-list-container');
    
    if (!container) {
        return;
    }
    
    // Get all asset items in the DOM
    const assetItems = container.querySelectorAll('.asset-item');
    
    assetItems.forEach((item, index) => {
        const asset = assets[index];
        
        if (!asset) {
            return;
        }
        
        // Get price and change elements
        const priceElement = item.querySelector('.asset-item__price');
        const changeElement = item.querySelector('.asset-item__change');
        
        if (!priceElement || !changeElement) {
            return;
        }
        
        // Update price
        priceElement.textContent = formatCurrency(asset.currentPrice, asset.currency);
        
        // Update change percentage
        const changePercent = asset.priceChangePercent;
        changeElement.textContent = formatPercent(changePercent);
        
        // Update change class (positive/negative)
        changeElement.classList.remove('asset-item__change--positive', 'asset-item__change--negative');
        if (changePercent >= 0) {
            changeElement.classList.add('asset-item__change--positive');
        } else {
            changeElement.classList.add('asset-item__change--negative');
        }
        
        // Flash animation on price change
        flashPriceChange(priceElement, changePercent);
    });
}

/**
 * Flash the price element with color based on change direction
 * @param {HTMLElement} element - Price element to flash
 * @param {number} changePercent - Percentage change
 */
function flashPriceChange(element, changePercent) {
    // Remove existing flash classes
    element.classList.remove('price-flash-green', 'price-flash-red');
    
    // Determine flash color
    const flashClass = changePercent >= 0 ? 'price-flash-green' : 'price-flash-red';
    
    // Add flash class
    element.classList.add(flashClass);
    
    // Remove flash class after animation
    setTimeout(() => {
        element.classList.remove(flashClass);
    }, 500);
}

/**
 * Track which market tab is currently active
 */
function trackCurrentMarket() {
    // Listen for tab clicks
    document.querySelectorAll('[data-market]').forEach(tab => {
        tab.addEventListener('click', () => {
            const market = tab.getAttribute('data-market');
            currentMarket = market;
            console.log(`✓ Switched to ${market} market`);
        });
    });
}

/* ==========================================================================
   Portfolio Update Event Listener
   ========================================================================== */

/**
 * Set up listener for portfolio update events
 */
function setupPortfolioUpdateListener() {
    document.addEventListener('portfolioUpdate', (event) => {
        const { newBalance, transaction } = event.detail;
        
        console.log('✓ Portfolio updated:', { newBalance, transaction });
        
        // Update balance display in header
        updateBalanceDisplay(newBalance);
        
        
        // Update charts after trade execution
        const portfolio = getPortfolioState();
        if (portfolio) {
            const pnlData = calculatePortfolioPnL(portfolio, liveMarketData);
            updatePortfolioChart(pnlData.totalValue);
            updateAllocationChart(portfolio, pnlData);
        }
        // Refresh portfolio display with current market data
        const marketData = marketSimulator.getMarketData();
        const liveMarketData = {
            indianStocks: marketData.indianStocks,
            usStocks: marketData.usStocks,
            cryptocurrencies: marketData.cryptocurrencies
        };
        refreshPortfolioDisplay(liveMarketData);
    });
    
    console.log('✓ Portfolio update listener registered');
}

/**
 * Update balance display in dashboard header
 * @param {number} newBalance - New balance amount
 */
function updateBalanceDisplay(newBalance) {
    const balanceElement = document.getElementById('available-balance');
    
    if (balanceElement) {
        balanceElement.textContent = formatCurrency(newBalance, 'USD');
        
        // Flash animation
        balanceElement.classList.add('price-flash-green');
        setTimeout(() => {
            balanceElement.classList.remove('price-flash-green');
        }, 500);
    }
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    setupMarketUpdateListener,
    setupPortfolioUpdateListener,
    updateVisibleWatchlist,
    flashPriceChange,
    updateBalanceDisplay
};
