/* ==========================================================================
   Notification System - Toast Notifications
   ========================================================================== */

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Add icon based on type
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification__icon">${icon}</div>
        <div class="notification__message">${message}</div>
        <button class="notification__close" aria-label="Close notification">×</button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('notification--visible');
    }, 10);
    
    // Set up close button
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

/**
 * Remove notification from DOM
 * @param {HTMLElement} notification - Notification element
 */
function removeNotification(notification) {
    notification.classList.remove('notification--visible');
    notification.classList.add('notification--removing');
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Get icon for notification type
 * @param {string} type - Notification type
 * @returns {string} Icon HTML
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    return icons[type] || icons.info;
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
export function showSuccess(message) {
    showNotification(message, 'success', 3000);
}

/**
 * Show error notification
 * @param {string} message - Error message
 */
export function showError(message) {
    showNotification(message, 'error', 4000);
}

/**
 * Show warning notification
 * @param {string} message - Warning message
 */
export function showWarning(message) {
    showNotification(message, 'warning', 3500);
}

/**
 * Show info notification
 * @param {string} message - Info message
 */
export function showInfo(message) {
    showNotification(message, 'info', 3000);
}
