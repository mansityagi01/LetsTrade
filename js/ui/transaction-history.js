/* ==========================================================================
   Transaction History - Ledger Display
   ========================================================================== */

import { formatCurrency, formatQuantity } from '../utils/formatters.js';
import { formatTimestamp } from '../utils/date-utils.js';
import { getPortfolioState } from '../main.js';
import { getTransactionHistory } from '../services/trade-executor.js';

/* ==========================================================================
   Render Transaction History
   ========================================================================== */

/**
 * Render transaction history table
 */
export function renderTransactionHistory() {
    const portfolio = getPortfolioState();
    
    // Get transactions from portfolio state or fallback to localStorage
    let transactions = [];
    if (portfolio && portfolio.transactionHistory) {
        transactions = portfolio.transactionHistory;
    } else {
        transactions = getTransactionHistory();
    }
    
    // Get table body element
    const tableBody = document.getElementById('transaction-history-body');
    
    if (!tableBody) {
        console.warn('Transaction history table body not found');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Check if there are any transactions
    if (!transactions || transactions.length === 0) {
        renderEmptyState(tableBody);
        return;
    }
    
    // Sort transactions by timestamp (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Render each transaction as a table row
    sortedTransactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tableBody.appendChild(row);
    });
    
    console.log(`✓ Transaction history rendered: ${sortedTransactions.length} transactions`);
}

/**
 * Create a table row for a single transaction
 * @param {Object} transaction - Transaction object
 * @returns {HTMLElement} Table row element
 */
function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    row.className = 'transaction-table__row';
    row.dataset.transactionId = transaction.id;
    
    // Format timestamp
    const timestamp = formatTimestamp(transaction.timestamp);
    
    // Determine transaction type styling
    const typeBadgeClass = transaction.type === 'BUY' 
        ? 'transaction-badge transaction-badge--buy' 
        : 'transaction-badge transaction-badge--sell';
    
    // Format realized P&L
    let realizedPnLCell = '<span class="text-muted">—</span>';
    if (transaction.type === 'SELL' && transaction.realizedPnL !== null && transaction.realizedPnL !== undefined) {
        const pnlClass = transaction.realizedPnL >= 0 ? 'pnl-positive' : 'pnl-negative';
        const pnlSign = transaction.realizedPnL >= 0 ? '+' : '';
        realizedPnLCell = `<span class="${pnlClass}">${pnlSign}${formatCurrency(Math.abs(transaction.realizedPnL), 'USD')}</span>`;
    }
    
    // Build row HTML
    row.innerHTML = `
        <td class="transaction-table__cell transaction-table__cell--timestamp">
            ${timestamp}
        </td>
        <td class="transaction-table__cell transaction-table__cell--type">
            <span class="${typeBadgeClass}">${transaction.type}</span>
        </td>
        <td class="transaction-table__cell transaction-table__cell--symbol">
            <div class="transaction-table__asset-info">
                <span class="transaction-table__symbol">${transaction.symbol}</span>
                <span class="transaction-table__name">${transaction.name}</span>
            </div>
        </td>
        <td class="transaction-table__cell transaction-table__cell--quantity">
            ${formatQuantity(transaction.quantity)}
        </td>
        <td class="transaction-table__cell transaction-table__cell--price">
            ${formatCurrency(transaction.executionPrice, transaction.currency)}
        </td>
        <td class="transaction-table__cell transaction-table__cell--total">
            ${formatCurrency(transaction.totalValue, 'USD')}
        </td>
        <td class="transaction-table__cell transaction-table__cell--pnl">
            ${realizedPnLCell}
        </td>
    `;
    
    return row;
}

/**
 * Render empty state when no transactions exist
 * @param {HTMLElement} tableBody - Table body element
 */
function renderEmptyState(tableBody) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'transaction-table__empty';
    
    emptyRow.innerHTML = `
        <td colspan="7" class="transaction-table__empty-cell">
            <div class="transaction-table__empty-state">
                <div class="transaction-table__empty-icon">📋</div>
                <div class="transaction-table__empty-text">
                    No transactions yet. Your trading history will appear here.
                </div>
            </div>
        </td>
    `;
    
    tableBody.appendChild(emptyRow);
}

/**
 * Initialize transaction history display
 */
export function initializeTransactionHistory() {
    renderTransactionHistory();
    
    // Listen for portfolio updates to refresh history
    document.addEventListener('portfolioUpdate', () => {
        renderTransactionHistory();
    });
    
    console.log('✓ Transaction history initialized');
}

/**
 * Filter transactions by type
 * @param {string} type - Transaction type ('BUY', 'SELL', or 'ALL')
 */
export function filterTransactions(type = 'ALL') {
    const portfolio = getPortfolioState();
    let transactions = portfolio?.transactionHistory || getTransactionHistory();
    
    if (type !== 'ALL') {
        transactions = transactions.filter(t => t.type === type);
    }
    
    const tableBody = document.getElementById('transaction-history-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (transactions.length === 0) {
        renderEmptyState(tableBody);
        return;
    }
    
    const sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sortedTransactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tableBody.appendChild(row);
    });
}

/**
 * Export transaction history as CSV
 */
export function exportTransactionsCSV() {
    const portfolio = getPortfolioState();
    const transactions = portfolio?.transactionHistory || getTransactionHistory();
    
    if (!transactions || transactions.length === 0) {
        alert('No transactions to export');
        return;
    }
    
    // Create CSV header
    const headers = ['Timestamp', 'Type', 'Symbol', 'Name', 'Quantity', 'Execution Price', 'Currency', 'Total Value (USD)', 'Realized P&L (USD)'];
    
    // Create CSV rows
    const rows = transactions.map(t => [
        formatTimestamp(t.timestamp),
        t.type,
        t.symbol,
        t.name,
        t.quantity,
        t.executionPrice,
        t.currency,
        t.totalValue,
        t.realizedPnL !== null ? t.realizedPnL : 'N/A'
    ]);
    
    // Combine into CSV string
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `letstrade_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✓ Transactions exported to CSV');
}
