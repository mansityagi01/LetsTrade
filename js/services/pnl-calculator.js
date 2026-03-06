/* ==========================================================================
   P&L Calculator - Portfolio Profit & Loss Engine
   ========================================================================== */

import { EXCHANGE_RATES } from '../data/currency-rates.js';

/* ==========================================================================
   Calculate Portfolio P&L
   ========================================================================== */

/**
 * Calculate portfolio profit and loss with live market data
 * @param {Object} portfolio - Current portfolio state
 * @param {Object} liveMarketData - Live market data from simulator
 * @returns {Object} Calculated P&L metrics
 */
export function calculatePortfolioPnL(portfolio, liveMarketData) {
    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
        return {
            totalValue: portfolio.balance || 0,
            totalPnL: 0,
            totalPnLPercentage: 0,
            holdings: []
        };
    }
    
    // Flatten all market data into single array
    const allAssets = [
        ...(liveMarketData.indianStocks || []),
        ...(liveMarketData.usStocks || []),
        ...(liveMarketData.cryptocurrencies || [])
    ];
    
    // Calculate P&L for each holding
    const enrichedHoldings = portfolio.holdings.map(holding => {
        // Find live price for this asset
        const liveAsset = allAssets.find(asset => asset.symbol === holding.symbol);
        
        if (!liveAsset) {
            console.warn(`Live price not found for ${holding.symbol}`);
            return {
                ...holding,
                currentPrice: holding.averageCost,
                currentValue: holding.averageCost * holding.quantity,
                unrealizedPnL: 0,
                unrealizedPnLPercentage: 0
            };
        }
        
        // Get live price
        const livePrice = liveAsset.currentPrice;
        
        // Calculate current value in local currency
        const currentValueLocal = livePrice * holding.quantity;
        
        // Calculate cost basis in local currency
        const costBasisLocal = holding.averageCost * holding.quantity;
        
        // Calculate P&L in local currency
        const unrealizedPnLLocal = currentValueLocal - costBasisLocal;
        
        // Convert to USD if needed
        let currentValueUSD = currentValueLocal;
        let costBasisUSD = costBasisLocal;
        let unrealizedPnLUSD = unrealizedPnLLocal;
        
        if (holding.currency === 'INR') {
            currentValueUSD = currentValueLocal * EXCHANGE_RATES.INR_TO_USD;
            costBasisUSD = costBasisLocal * EXCHANGE_RATES.INR_TO_USD;
            unrealizedPnLUSD = unrealizedPnLLocal * EXCHANGE_RATES.INR_TO_USD;
        }
        
        // Calculate percentage
        const unrealizedPnLPercentage = costBasisLocal !== 0 
            ? (unrealizedPnLLocal / costBasisLocal) * 100 
            : 0;
        
        return {
            ...holding,
            currentPrice: livePrice,
            currentValueLocal,
            currentValueUSD,
            costBasisLocal,
            costBasisUSD,
            unrealizedPnL: unrealizedPnLUSD,
            unrealizedPnLPercentage
        };
    });
    
    // Calculate portfolio totals
    const totalHoldingsValueUSD = enrichedHoldings.reduce((sum, holding) => {
        return sum + holding.currentValueUSD;
    }, 0);
    
    const totalCostBasisUSD = enrichedHoldings.reduce((sum, holding) => {
        return sum + holding.costBasisUSD;
    }, 0);
    
    const totalPnL = enrichedHoldings.reduce((sum, holding) => {
        return sum + holding.unrealizedPnL;
    }, 0);
    
    const totalValue = portfolio.balance + totalHoldingsValueUSD;
    
    const totalPnLPercentage = totalCostBasisUSD !== 0 
        ? (totalPnL / totalCostBasisUSD) * 100 
        : 0;
    
    return {
        totalValue,
        totalPnL,
        totalPnLPercentage,
        totalHoldingsValueUSD,
        totalCostBasisUSD,
        holdings: enrichedHoldings
    };
}

/**
 * Calculate P&L for a single holding
 * @param {Object} holding - Holding object
 * @param {number} currentPrice - Current market price
 * @returns {Object} Holding with P&L calculations
 */
export function calculateHoldingPnL(holding, currentPrice) {
    const currentValueLocal = currentPrice * holding.quantity;
    const costBasisLocal = holding.averageCost * holding.quantity;
    const unrealizedPnLLocal = currentValueLocal - costBasisLocal;
    
    let currentValueUSD = currentValueLocal;
    let costBasisUSD = costBasisLocal;
    let unrealizedPnLUSD = unrealizedPnLLocal;
    
    if (holding.currency === 'INR') {
        currentValueUSD = currentValueLocal * EXCHANGE_RATES.INR_TO_USD;
        costBasisUSD = costBasisLocal * EXCHANGE_RATES.INR_TO_USD;
        unrealizedPnLUSD = unrealizedPnLLocal * EXCHANGE_RATES.INR_TO_USD;
    }
    
    const unrealizedPnLPercentage = costBasisLocal !== 0 
        ? (unrealizedPnLLocal / costBasisLocal) * 100 
        : 0;
    
    return {
        ...holding,
        currentPrice,
        currentValueLocal,
        currentValueUSD,
        costBasisLocal,
        costBasisUSD,
        unrealizedPnL: unrealizedPnLUSD,
        unrealizedPnLPercentage
    };
}
