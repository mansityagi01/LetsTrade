/* ==========================================================================
   Auth Page Initialization - Form Tab Switching & Initialization
   ========================================================================== */

import { initializeLoginForm } from './login.js';
import { initializeRegistrationForm } from './register.js';

/**
 * Initialize auth page functionality
 */
function initAuthPage() {
    console.log('✓ Initializing authentication page...');
    
    // Initialize forms
    initializeLoginForm();
    initializeRegistrationForm();
    
    // Setup tab switching
    setupTabSwitching();
    
    // Setup form switchers within forms
    setupFormSwitchers();
    
    console.log('✓ Authentication page initialized');
}

/**
 * Setup tab switching between login and register
 */
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.auth__tab');
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('auth__tab--active'));
            tab.classList.add('auth__tab--active');
            
            // Show appropriate form
            if (targetTab === 'login') {
                loginContainer?.classList.add('auth__form-container--active');
                registerContainer?.classList.remove('auth__form-container--active');
            } else if (targetTab === 'register') {
                registerContainer?.classList.add('auth__form-container--active');
                loginContainer?.classList.remove('auth__form-container--active');
            }
        });
    });
}

/**
 * Setup form switcher links (e.g., "Create one now")
 */
function setupFormSwitchers() {
    const switchers = document.querySelectorAll('[data-switch]');
    const tabs = document.querySelectorAll('.auth__tab');
    
    switchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetForm = switcher.dataset.switch;
            
            // Find and click the corresponding tab
            const targetTab = Array.from(tabs).find(tab => tab.dataset.tab === targetForm);
            targetTab?.click();
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    initAuthPage();
}

export { initAuthPage };
