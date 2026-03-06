/* ==========================================================================
   Portfolio Chart - Line Chart Visualization
   ========================================================================== */

import { formatCurrency } from '../utils/formatters.js';

let portfolioChart = null;
let chartData = {
    labels: ['Start'],
    values: [10000]
};

/* ==========================================================================
   Initialize Portfolio Chart
   ========================================================================== */

/**
 * Initialize the portfolio line chart
 * @param {string} canvasId - Canvas element ID
 * @param {number} initialBalance - Starting balance
 */
export function initializePortfolioChart(canvasId, initialBalance = 10000) {
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        console.warn(`Canvas with ID "${canvasId}" not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Initialize data with starting balance
    chartData = {
        labels: [new Date().toLocaleTimeString()],
        values: [initialBalance]
    };
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
    
    // Chart configuration
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Portfolio Value',
                data: chartData.values,
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#3b82f6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
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
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y, 'USD');
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: 11
                        },
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        }
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
    
    console.log('✓ Portfolio chart initialized');
    return portfolioChart;
}

/**
 * Update portfolio chart with new value
 * @param {number} portfolioValue - New portfolio value
 */
export function updatePortfolioChart(portfolioValue) {
    if (!portfolioChart) {
        console.warn('Portfolio chart not initialized');
        return;
    }
    
    // Add new data point
    const timestamp = new Date().toLocaleTimeString();
    chartData.labels.push(timestamp);
    chartData.values.push(portfolioValue);
    
    // Keep only last 20 data points for performance
    if (chartData.labels.length > 20) {
        chartData.labels.shift();
        chartData.values.shift();
    }
    
    // Update chart data
    portfolioChart.data.labels = chartData.labels;
    portfolioChart.data.datasets[0].data = chartData.values;
    
    // Animate update
    portfolioChart.update('none');
}

/**
 * Reset portfolio chart to initial state
 * @param {number} initialBalance - Starting balance
 */
export function resetPortfolioChart(initialBalance = 10000) {
    if (!portfolioChart) {
        return;
    }
    
    chartData = {
        labels: [new Date().toLocaleTimeString()],
        values: [initialBalance]
    };
    
    portfolioChart.data.labels = chartData.labels;
    portfolioChart.data.datasets[0].data = chartData.values;
    portfolioChart.update();
}

/**
 * Get chart instance
 * @returns {Chart} Chart.js instance
 */
export function getPortfolioChart() {
    return portfolioChart;
}
