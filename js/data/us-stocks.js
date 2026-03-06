/* ==========================================================================
   US Stocks Mock Data - Major US Equities
   ========================================================================== */

/**
 * Major US stocks from various sectors
 * Prices are in USD (US Dollars)
 * Base prices represent indicative market values as of March 2026
 */
export const usStocks = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        basePrice: 187.45,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$2.91T USD',
        description: 'Consumer electronics, software, and online services'
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        basePrice: 421.30,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$3.13T USD',
        description: 'Software, cloud computing, gaming, and AI solutions'
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        sector: 'Technology',
        basePrice: 142.85,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$1.79T USD',
        description: 'Online advertising, search engine, cloud computing, AI'
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        sector: 'E-commerce',
        basePrice: 178.25,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$1.85T USD',
        description: 'E-commerce, cloud computing (AWS), digital streaming'
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        sector: 'Semiconductors',
        basePrice: 892.60,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$2.20T USD',
        description: 'Graphics processing units (GPUs), AI chips, and gaming'
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        sector: 'Automotive',
        basePrice: 245.80,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$780B USD',
        description: 'Electric vehicles, clean energy, and autonomous driving'
    },
    {
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        sector: 'Social Media',
        basePrice: 512.35,
        currency: 'USD',
        exchange: 'NASDAQ',
        marketCap: '$1.31T USD',
        description: 'Social networking, metaverse, VR/AR, and digital advertising'
    },
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        sector: 'Banking',
        basePrice: 198.70,
        currency: 'USD',
        exchange: 'NYSE',
        marketCap: '$578B USD',
        description: 'Investment banking, financial services, asset management'
    },
    {
        symbol: 'V',
        name: 'Visa Inc.',
        sector: 'Payments',
        basePrice: 287.15,
        currency: 'USD',
        exchange: 'NYSE',
        marketCap: '$598B USD',
        description: 'Global payments technology and digital transactions'
    },
    {
        symbol: 'WMT',
        name: 'Walmart Inc.',
        sector: 'Retail',
        basePrice: 165.40,
        currency: 'USD',
        exchange: 'NYSE',
        marketCap: '$445B USD',
        description: 'Multinational retail corporation - hypermarkets and e-commerce'
    }
];

/**
 * Get stock by symbol
 * @param {string} symbol - Stock symbol
 * @returns {Object|undefined} Stock object or undefined
 */
export function getUSStockBySymbol(symbol) {
    return usStocks.find(stock => stock.symbol === symbol);
}

/**
 * Get stocks by sector
 * @param {string} sector - Sector name
 * @returns {Array} Array of stocks in the sector
 */
export function getUSStocksBySector(sector) {
    return usStocks.filter(stock => stock.sector === sector);
}
