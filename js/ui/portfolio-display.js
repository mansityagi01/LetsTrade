/* ==========================================================================
   Portfolio Display - Holdings Table Renderer
   ========================================================================== */

import { calculatePortfolioPnL } from '../services/pnl-calculator.js';
import { formatCurrency, formatPercent, formatQuantity } from '../utils/formatters.js';
import { getPortfolioState } from '../main.js';

/* ==========================================================================
   Render Holdings Table
   ========================================================================== */

/**
 * Render holdings table with live P&L calculations
 * @param {Object} liveMarketData - Live market data from simulator
 */
export function renderHoldingsTable(liveMarketData) {
    const portfolio = getPortfolioState();
    
    if (!portfolio) {
        console.warn('Portfolio state not available');
        return;
    }
    
    // Calculate P&L with live market data
    const pnlData = calculatePortfolioPnL(portfolio, liveMarketData);
    
    // Get table body element
    const tableBody = document.getElementById('holdings-table-body');
    
    if (!tableBody) {
        console.warn('Holdings table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Check if user has any holdings
    if (!pnlData.holdings || pnlData.holdings.length === 0) {
        renderEmptyState(tableBody);
        return;
    }
    
    // Render each holding as a table row
    pnlData.holdings.forEach(holding => {
        const row = createHoldingRow(holding);
        tableBody.appendChild(row);
    });
    
    console.log('✓ Holdings table rendered with P&L calculations');
}

/**
 * Create a table row for a single holding
 * @param {Object} holding - Holding object with P&L data
 * @returns {HTMLElement} Table row element
 */
function createHoldingRow(holding) {
    const row = document.createElement('tr');
    row.className = 'holdings-table__row';
    row.dataset.symbol = holding.symbol;
    
    // Determine P&L class
    const pnlClass = holding.unrealizedPnL >= 0 ? 'pnl-positive' : 'pnl-negative';
    const pnlSign = holding.unrealizedPnL >= 0 ? '+' : '';
    
    // Build row HTML
    row.innerHTML = `
        <td class="holdings-table__cell holdings-table__cell--symbol">
            <div class="holdings-table__asset-info">
                <span class="holdings-table__symbol">${holding.symbol}</span>
                <span class="holdings-table__name">${holding.name}</span>
            </div>
        </td>
        <td class="holdings-table__cell holdings-table__cell--quantity">
            ${formatQuantity(holding.quantity)}
        </td>
        <td class="holdings-table__cell holdings-table__cell--avg-cost">
            ${formatCurrency(holding.averageCost, holding.currency)}
        </td>
        <td class="holdings-table__cell holdings-table__cell--current-price">
            ${formatCurrency(holding.currentPrice, holding.currency)}
        </td>
        <td class="holdings-table__cell holdings-table__cell--value">
            ${formatCurrency(holding.currentValueUSD, 'USD')}
        </td>
        <td class="holdings-table__cell holdings-table__cell--pnl ${pnlClass}">
            <div class="pnl-display">
                <span class="pnl-display__value">${pnlSign}${formatCurrency(Math.abs(holding.unrealizedPnL), 'USD')}</span>
                <span class="pnl-display__percentage">(${formatPercent(holding.unrealizedPnLPercentage)})</span>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Render empty state when no holdings exist
 * @param {HTMLElement} tableBody - Table body element
 */
function renderEmptyState(tableBody) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'holdings-table__empty';
    
    emptyRow.innerHTML = `
        <td colspan="6" class="holdings-table__empty-cell">
            <div class="holdings-table__empty-state">
                <div class="holdings-table__empty-icon">📊</div>
                <div class="holdings-table__empty-text">
                    No open positions. Execute a trade to start building your portfolio.
                </div>
            </div>
        </td>
    `;
    
    tableBody.appendChild(emptyRow);
}

/**
 * Update portfolio summary in header
 * @param {Object} pnlData - P&L calculation results
 */
export function updatePortfolioSummary(pnlData) {
    // Update portfolio value
    const portfolioValueElement = document.getElementById('portfolio-value');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = formatCurrency(pnlData.totalValue, 'USD');
    }
    
    // Update total P&L
    const totalPnLElement = document.getElementById('total-pnl');
    if (totalPnLElement) {
        const pnl = pnlData.totalPnL;
        const pnlPercentage = pnlData.totalPnLPercentage;
        const sign = pnl >= 0 ? '+' : '';
        
        totalPnLElement.textContent = `${sign}${formatCurrency(Math.abs(pnl), 'USD')} (${formatPercent(pnlPercentage)})`;
        
        // Update class
        totalPnLElement.className = 'dashboard-header__value';
        if (pnl >= 0) {
            totalPnLElement.classList.add('pnl-positive');
        } else {
            totalPnLElement.classList.add('pnl-negative');
        }
    }
    
    // Update available balance
    const portfolio = getPortfolioState();
    if (portfolio) {
        const balanceElement = document.getElementById('available-balance');
        if (balanceElement) {
            balanceElement.textContent = formatCurrency(portfolio.balance, 'USD');
        }
    }
}

/**
 * Refresh entire portfolio display
 * @param {Object} liveMarketData - Live market data
 */
export function refreshPortfolioDisplay(liveMarketData) {
    const portfolio = getPortfolioState();
    
    if (!portfolio) {
        return;
    }
    
    // Calculate P&L
    const pnlData = calculatePortfolioPnL(portfolio, liveMarketData);
    
    // Update table
    renderHoldingsTable(liveMarketData);
    
    // Update summary
    updatePortfolioSummary(pnlData);
}

/* ==========================================================================
   Export Functions
   ========================================================================== */

export {
    createHoldingRow,
    renderEmptyState
};
