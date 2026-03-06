/* ==========================================================================
   Market Simulator - Real-Time Price Fluctuation Engine
   ========================================================================== */

import { indianStocks } from '../data/indian-stocks.js';
import { usStocks } from '../data/us-stocks.js';
import { cryptocurrencies } from '../data/cryptocurrencies.js';

/* ==========================================================================
   Market Simulator Class
   ========================================================================== */

class MarketSimulator {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
        this.updateInterval = 2500; // 2.5 seconds
        
        // Market data with current prices
        this.marketData = {
            indianStocks: this.initializeMarketData(indianStocks),
            usStocks: this.initializeMarketData(usStocks),
            cryptocurrencies: this.initializeMarketData(cryptocurrencies)
        };
        
        // Volatility profiles (percentage change per tick)
        this.volatilityProfiles = {
            indianStocks: 0.003, // 0.3% max change per tick
            usStocks: 0.003,     // 0.3% max change per tick
            cryptocurrencies: 0.015 // 1.5% max change per tick
        };
        
        console.log('✓ Market Simulator initialized');
    }
    
    /**
     * Initialize market data with current prices
     * @param {Array} assetArray - Array of asset objects
     * @returns {Array} Market data with tracking properties
     */
    initializeMarketData(assetArray) {
        return assetArray.map(asset => ({
            ...asset,
            currentPrice: asset.basePrice,
            previousPrice: asset.basePrice,
            priceChange: 0,
            priceChangePercent: 0,
            dailyHigh: asset.basePrice,
            dailyLow: asset.basePrice,
            volume: Math.floor(Math.random() * 1000000) + 100000
        }));
    }
    
    /**
     * Start the market simulation
     */
    startSimulation() {
        if (this.isRunning) {
            console.warn('Market simulation already running');
            return;
        }
        
        this.isRunning = true;
        console.log('✓ Market simulation started');
        
        // Initial update
        this.updateMarketPrices();
        
        // Start interval loop
        this.intervalId = setInterval(() => {
            this.updateMarketPrices();
        }, this.updateInterval);
    }
    
    /**
     * Stop the market simulation
     */
    stopSimulation() {
        if (!this.isRunning) {
            console.warn('Market simulation not running');
            return;
        }
        
        this.isRunning = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('✓ Market simulation stopped');
    }
    
    /**
     * Update all market prices using random walk algorithm
     */
    updateMarketPrices() {
        // Update Indian Stocks
        this.marketData.indianStocks = this.applyRandomWalk(
            this.marketData.indianStocks,
            this.volatilityProfiles.indianStocks
        );
        
        // Update US Stocks
        this.marketData.usStocks = this.applyRandomWalk(
            this.marketData.usStocks,
            this.volatilityProfiles.usStocks
        );
        
        // Update Cryptocurrencies
        this.marketData.cryptocurrencies = this.applyRandomWalk(
            this.marketData.cryptocurrencies,
            this.volatilityProfiles.cryptocurrencies
        );
        
        // Broadcast market update event
        this.broadcastMarketUpdate();
    }
    
    /**
     * Apply random walk algorithm to asset prices
     * @param {Array} assetArray - Array of assets
     * @param {number} volatility - Volatility percentage
     * @returns {Array} Updated assets with new prices
     */
    applyRandomWalk(assetArray, volatility) {
        return assetArray.map(asset => {
            // Store previous price
            const previousPrice = asset.currentPrice;
            
            // Generate random percentage change (-volatility to +volatility)
            const randomChange = (Math.random() * 2 - 1) * volatility;
            
            // Calculate new price
            let newPrice = asset.currentPrice * (1 + randomChange);
            
            // Prevent prices from going negative or too low
            const minimumPrice = asset.basePrice * 0.5; // Don't drop below 50% of base
            if (newPrice < minimumPrice) {
                newPrice = minimumPrice;
            }
            
            // Prevent prices from going too high
            const maximumPrice = asset.basePrice * 2; // Don't exceed 200% of base
            if (newPrice > maximumPrice) {
                newPrice = maximumPrice;
            }
            
            // Calculate price change
            const priceChange = newPrice - previousPrice;
            const priceChangePercent = (priceChange / previousPrice) * 100;
            
            // Update daily high/low
            const dailyHigh = Math.max(asset.dailyHigh, newPrice);
            const dailyLow = Math.min(asset.dailyLow, newPrice);
            
            // Update volume (simulate realistic volume changes)
            const volumeChange = Math.floor((Math.random() * 0.1 - 0.05) * asset.volume);
            const volume = Math.max(asset.volume + volumeChange, 10000);
            
            return {
                ...asset,
                previousPrice,
                currentPrice: newPrice,
                priceChange,
                priceChangePercent,
                dailyHigh,
                dailyLow,
                volume
            };
        });
    }
    
    /**
     * Broadcast market update event to the DOM
     */
    broadcastMarketUpdate() {
        const allAssets = {
            indianStocks: this.marketData.indianStocks,
            usStocks: this.marketData.usStocks,
            cryptocurrencies: this.marketData.cryptocurrencies,
            timestamp: new Date().toISOString()
        };
        
        // Dispatch custom event
        const event = new CustomEvent('marketUpdate', {
            detail: allAssets
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Get current market data
     * @returns {Object} Current market data
     */
    getMarketData() {
        return this.marketData;
    }
    
    /**
     * Get asset by symbol
     * @param {string} symbol - Asset symbol
     * @returns {Object|null} Asset object or null
     */
    getAssetBySymbol(symbol) {
        // Search in all markets
        const allAssets = [
            ...this.marketData.indianStocks,
            ...this.marketData.usStocks,
            ...this.marketData.cryptocurrencies
        ];
        
        return allAssets.find(asset => asset.symbol === symbol) || null;
    }
    
    /**
     * Reset market to base prices
     */
    resetMarket() {
        this.marketData = {
            indianStocks: this.initializeMarketData(indianStocks),
            usStocks: this.initializeMarketData(usStocks),
            cryptocurrencies: this.initializeMarketData(cryptocurrencies)
        };
        
        console.log('✓ Market reset to base prices');
        this.broadcastMarketUpdate();
    }
}

// Create singleton instance
const marketSimulator = new MarketSimulator();

/* ==========================================================================
   Export Functions
   ========================================================================== */

export default marketSimulator;

export {
    marketSimulator,
    MarketSimulator
};
