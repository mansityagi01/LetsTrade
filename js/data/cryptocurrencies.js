/* ==========================================================================
   Cryptocurrencies Mock Data - Major Digital Assets
   ========================================================================== */

/**
 * Major cryptocurrencies by market capitalization
 * Prices are in USD (US Dollars)
 * Base prices represent indicative market values as of March 2026
 */
export const cryptocurrencies = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        sector: 'Cryptocurrency',
        basePrice: 68420.50,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$1.34T USD',
        description: 'First and largest cryptocurrency - digital gold'
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        sector: 'Smart Contracts',
        basePrice: 3542.75,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$425B USD',
        description: 'Leading smart contract platform and DeFi ecosystem'
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        sector: 'Smart Contracts',
        basePrice: 142.30,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$63B USD',
        description: 'High-performance blockchain for DeFi and NFTs'
    },
    {
        symbol: 'BNB',
        name: 'BNB',
        sector: 'Exchange Token',
        basePrice: 485.60,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$72B USD',
        description: 'Binance ecosystem token and trading fee utility'
    },
    {
        symbol: 'ADA',
        name: 'Cardano',
        sector: 'Smart Contracts',
        basePrice: 0.687,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$24B USD',
        description: 'Proof-of-stake blockchain platform with academic approach'
    },
    {
        symbol: 'AVAX',
        name: 'Avalanche',
        sector: 'Smart Contracts',
        basePrice: 42.85,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$16B USD',
        description: 'Fast smart contracts platform with subnets architecture'
    },
    {
        symbol: 'DOT',
        name: 'Polkadot',
        sector: 'Interoperability',
        basePrice: 8.92,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$12B USD',
        description: 'Multi-chain interoperability protocol for Web3'
    },
    {
        symbol: 'MATIC',
        name: 'Polygon',
        sector: 'Layer 2',
        basePrice: 1.14,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$11B USD',
        description: 'Ethereum scaling solution with PoS sidechain'
    },
    {
        symbol: 'LINK',
        name: 'Chainlink',
        sector: 'Oracle Network',
        basePrice: 18.76,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$11B USD',
        description: 'Decentralized oracle network for smart contracts'
    },
    {
        symbol: 'UNI',
        name: 'Uniswap',
        sector: 'DeFi',
        basePrice: 12.45,
        currency: 'USD',
        exchange: 'Crypto',
        marketCap: '$9.4B USD',
        description: 'Leading decentralized exchange (DEX) protocol'
    }
];

/**
 * Get cryptocurrency by symbol
 * @param {string} symbol - Crypto symbol
 * @returns {Object|undefined} Crypto object or undefined
 */
export function getCryptoBySymbol(symbol) {
    return cryptocurrencies.find(crypto => crypto.symbol === symbol);
}

/**
 * Get cryptocurrencies by sector
 * @param {string} sector - Sector name
 * @returns {Array} Array of cryptocurrencies in the sector
 */
export function getCryptosBySector(sector) {
    return cryptocurrencies.filter(crypto => crypto.sector === sector);
}

/**
 * Get top cryptocurrencies by market cap
 * @param {number} limit - Number of top cryptos to return
 * @returns {Array} Top cryptocurrencies
 */
export function getTopCryptos(limit = 5) {
    return cryptocurrencies.slice(0, limit);
}
