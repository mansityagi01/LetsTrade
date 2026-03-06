/* ==========================================================================
   Indian Stocks Mock Data - NIFTY 50 Companies
   ========================================================================== */

/**
 * Top Indian stocks from the NIFTY 50 index
 * Prices are in INR (Indian Rupees)
 * Base prices represent indicative market values as of March 2026
 */
export const indianStocks = [
    {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        sector: 'Oil & Gas',
        basePrice: 2847.50,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '19.2T INR',
        description: 'Largest private sector corporation in India - Oil, Retail, Telecom'
    },
    {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        sector: 'IT Services',
        basePrice: 4125.30,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '15.1T INR',
        description: 'Leading global IT services and consulting company'
    },
    {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        sector: 'Banking',
        basePrice: 1687.80,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '12.8T INR',
        description: 'India\'s largest private sector bank by assets'
    },
    {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        sector: 'IT Services',
        basePrice: 1542.60,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '6.4T INR',
        description: 'Multinational IT services and consulting company'
    },
    {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        sector: 'Banking',
        basePrice: 1089.45,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '7.6T INR',
        description: 'Second largest private sector bank in India'
    },
    {
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel Ltd',
        sector: 'Telecom',
        basePrice: 1345.20,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '7.8T INR',
        description: 'Leading telecommunications services provider'
    },
    {
        symbol: 'SBIN',
        name: 'State Bank of India',
        sector: 'Banking',
        basePrice: 742.90,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '6.6T INR',
        description: 'India\'s largest public sector bank'
    },
    {
        symbol: 'HINDUNILVR',
        name: 'Hindustan Unilever Ltd',
        sector: 'FMCG',
        basePrice: 2564.75,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '6.0T INR',
        description: 'Leading FMCG company - consumer goods and personal care'
    },
    {
        symbol: 'ITC',
        name: 'ITC Ltd',
        sector: 'Conglomerate',
        basePrice: 478.35,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '5.9T INR',
        description: 'Diversified conglomerate - FMCG, Hotels, Paperboards, Agri'
    },
    {
        symbol: 'LT',
        name: 'Larsen & Toubro Ltd',
        sector: 'Engineering',
        basePrice: 3521.60,
        currency: 'INR',
        exchange: 'NSE',
        marketCap: '4.9T INR',
        description: 'Major technology, engineering, and construction company'
    }
];

/**
 * Get stock by symbol
 * @param {string} symbol - Stock symbol
 * @returns {Object|undefined} Stock object or undefined
 */
export function getIndianStockBySymbol(symbol) {
    return indianStocks.find(stock => stock.symbol === symbol);
}

/**
 * Get stocks by sector
 * @param {string} sector - Sector name
 * @returns {Array} Array of stocks in the sector
 */
export function getIndianStocksBySector(sector) {
    return indianStocks.filter(stock => stock.sector === sector);
}
