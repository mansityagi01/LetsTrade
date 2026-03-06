/* ==========================================================================
   Allocation Chart - Doughnut Chart Visualization
   ========================================================================== */

import { formatCurrency } from '../utils/formatters.js';

let allocationChart = null;

/* ==========================================================================
   Initialize Allocation Chart
   ========================================================================== */

/**
 * Initialize the portfolio allocation doughnut chart
 * @param {string} canvasId - Canvas element ID
 */
export function initializeAllocationChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        console.warn(`Canvas with ID "${canvasId}" not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Initial allocation (100% cash)
    const initialData = {
        labels: ['Cash', 'Indian Stocks', 'US Stocks', 'Crypto'],
        values: [10000, 0, 0, 0],
        colors: [
            '#3b82f6', // Cash - Blue
            '#f59e0b', // Indian Stocks - Orange
            '#10b981', // US Stocks - Green
            '#8b5cf6'  // Crypto - Purple
        ]
    };
    
    // Chart configuration
    allocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: initialData.labels,
            datasets: [{
                data: initialData.values,
                backgroundColor: initialData.colors,
                borderColor: '#0a0e1a',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    titleColor: '#e5e7eb',
                    bodyColor: '#e5e7eb',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${formatCurrency(value, 'USD')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    console.log('✓ Allocation chart initialized');
    return allocationChart;
}

/**
 * Update allocation chart with portfolio holdings
 * @param {Object} portfolio - Portfolio state
 * @param {Object} pnlData - P&L calculation data
 */
export function updateAllocationChart(portfolio, pnlData) {
    if (!allocationChart) {
        console.warn('Allocation chart not initialized');
        return;
    }
    
    // Calculate allocation by asset type
    const allocation = {
        cash: portfolio.balance,
        indianStocks: 0,
        usStocks: 0,
        crypto: 0
    };
    
    // Sum up holdings by market
    if (pnlData && pnlData.holdings) {
        pnlData.holdings.forEach(holding => {
            const valueUSD = holding.currentValueUSD || 0;
            
            if (holding.currency === 'INR') {
                allocation.indianStocks += valueUSD;
            } else if (holding.sector === 'Cryptocurrency' || holding.sector === 'Smart Contracts' || 
                       holding.sector === 'Exchange Token' || holding.sector === 'Interoperability' || 
                       holding.sector === 'Layer 2' || holding.sector === 'Oracle Network' || 
                       holding.sector === 'DeFi') {
                allocation.crypto += valueUSD;
            } else {
                allocation.usStocks += valueUSD;
            }
        });
    }
    
    // Update chart data
    allocationChart.data.datasets[0].data = [
        allocation.cash,
        allocation.indianStocks,
        allocation.usStocks,
        allocation.crypto
    ];
    
    // Animate update
    allocationChart.update('active');
}

/**
 * Reset allocation chart to initial state
 * @param {number} initialBalance - Starting balance
 */
export function resetAllocationChart(initialBalance = 10000) {
    if (!allocationChart) {
        return;
    }
    
    allocationChart.data.datasets[0].data = [initialBalance, 0, 0, 0];
    allocationChart.update();
}

/**
 * Get chart instance
 * @returns {Chart} Chart.js instance
 */
export function getAllocationChart() {
    return allocationChart;
}
