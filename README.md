# LetsTrade - Multi-Asset Paper Trading Simulator

## 📋 Project Overview

**LetsTrade** is a comprehensive web-based paper trading simulator that enables users to practice trading across multiple asset classes without financial risk. Each user begins with a virtual portfolio of **$10,000 USD** and can execute simulated trades across Indian Stocks, US Stocks, and Cryptocurrencies.

The platform provides real-time market simulation, portfolio tracking, and profit/loss (P&L) analytics to deliver an authentic trading experience for education and skill development.

---

## 🎯 Core Features

### Authentication & User Management
- **User Registration & Login System** with secure session management
- **Virtual Wallet Initialization** - Every user starts with exactly $10,000 USD
- **Persistent User Portfolio** - Trades and balances saved locally (localStorage/sessionStorage)

### Trading Sections
1. **Indian Stocks Trading**
   - Curated list of top Indian equities (NIFTY 50 stocks)
   - Real-time simulated price updates
   - INR → USD conversion for unified portfolio tracking

2. **US Stocks Trading**
   - Selection of major US equities (S&P 500, NASDAQ)
   - Live simulated price feeds
   - Direct USD denomination

3. **Cryptocurrency Trading**
   - Popular cryptocurrencies (BTC, ETH, BNB, SOL, etc.)
   - High-frequency price simulation
   - Market volatility representation

### Portfolio & Analytics Dashboard
- **Real-Time P&L Calculation** - Live updates based on current market prices
- **Holdings Overview** - Visual breakdown by asset class
- **Transaction History** - Complete ledger of all buy/sell orders
- **Performance Charts** - Portfolio value trends over time
- **Asset Allocation Pie Charts** - Distribution across stocks and crypto

### Trading Functionality
- **Buy Orders** - Purchase assets with available USD balance
- **Sell Orders** - Liquidate holdings to free up capital
- **Order Validation** - Check sufficient funds/holdings before execution
- **Fractional Trading Support** - Allow partial share/coin purchases
- **Real-Time Price Display** - Live ticker updates for all assets

---

## 📁 Project Structure

```
LetsTrade/
│
├── index.html                          # Main landing/authentication page
├── dashboard.html                      # Main trading dashboard (post-login)
├── README.md                           # Project documentation (this file)
│
├── assets/                             # Static assets directory
│   ├── images/
│   │   ├── logo.svg                    # LetsTrade brand logo
│   │   ├── hero-bg.jpg                 # Landing page hero background
│   │   ├── stock-icon.svg              # Stock market icon
│   │   ├── crypto-icon.svg             # Cryptocurrency icon
│   │   └── chart-placeholder.png       # Default chart visual
│   │
│   ├── icons/                          # Asset-specific icons
│   │   ├── indian-stocks/              # Icons for Indian stocks
│   │   ├── us-stocks/                  # Icons for US stocks
│   │   └── crypto/                     # Cryptocurrency logos
│   │
│   └── fonts/                          # Custom web fonts (if needed)
│       └── Roboto/
│
├── css/                                # Stylesheets directory
│   ├── reset.css                       # CSS reset/normalize
│   ├── variables.css                   # CSS custom properties (colors, spacing)
│   ├── global.css                      # Global styles (typography, utilities)
│   ├── auth.css                        # Login/register page styles
│   ├── dashboard.css                   # Main dashboard layout styles
│   ├── sidebar.css                     # Navigation sidebar component
│   ├── portfolio.css                   # Portfolio overview section styles
│   ├── trading-panel.css               # Buy/sell order panel styles
│   ├── asset-list.css                  # Asset table/card styles
│   ├── charts.css                      # Chart container and styling
│   ├── modal.css                       # Modal dialog styles
│   └── responsive.css                  # Media queries for mobile/tablet
│
├── js/                                 # JavaScript modules directory
│   ├── main.js                         # Application entry point
│   ├── config.js                       # Global configuration constants
│   │
│   ├── auth/                           # Authentication module
│   │   ├── login.js                    # Login form handling
│   │   ├── register.js                 # Registration logic
│   │   └── session.js                  # Session management (localStorage)
│   │
│   ├── data/                           # Static data and mock APIs
│   │   ├── indian-stocks.js            # Curated list of Indian stocks
│   │   ├── us-stocks.js                # Curated list of US stocks
│   │   ├── cryptocurrencies.js         # Curated list of cryptocurrencies
│   │   └── currency-rates.js           # INR/USD exchange rate data
│   │
│   ├── services/                       # Business logic services
│   │   ├── market-simulator.js         # Price simulation engine
│   │   ├── portfolio-service.js        # Portfolio CRUD operations
│   │   ├── trade-executor.js           # Order execution logic
│   │   └── pnl-calculator.js           # P&L computation engine
│   │
│   ├── ui/                             # UI components and rendering
│   │   ├── dashboard-controller.js     # Dashboard state management
│   │   ├── asset-renderer.js           # Render asset lists/tables
│   │   ├── portfolio-display.js        # Portfolio UI updates
│   │   ├── trading-form.js             # Buy/sell form interactions
│   │   ├── modal-handler.js            # Modal open/close logic
│   │   └── notification.js             # Toast/alert notifications
│   │
│   ├── charts/                         # Charting and visualization
│   │   ├── portfolio-chart.js          # Portfolio performance line chart
│   │   ├── allocation-chart.js         # Asset allocation pie chart
│   │   └── price-chart.js              # Individual asset price chart
│   │
│   └── utils/                          # Utility functions
│       ├── formatters.js               # Number/currency formatting
│       ├── validators.js               # Input validation helpers
│       ├── date-utils.js               # Date/time manipulation
│       └── storage.js                  # localStorage abstraction layer
│
├── data/                               # JSON data files
│   ├── initial-assets.json             # Complete asset catalog with metadata
│   └── mock-prices.json                # Initial price seeds for simulation
│
└── docs/                               # Additional documentation
    ├── API.md                          # Internal API documentation
    ├── USER-GUIDE.md                   # End-user instructions
    └── ARCHITECTURE.md                 # System architecture notes
```

---

## 🛠️ Tech Stack & Engineering Rationale

### Core Technologies

#### **HTML5**
- **Purpose**: Semantic document structure and accessibility
- **Key Features Used**: Forms, semantic tags (`<nav>`, `<section>`, `<article>`), data attributes

#### **CSS3**
- **Purpose**: Presentation layer and responsive design
- **Architecture**: Modular CSS with BEM methodology for component isolation
- **Key Features**: CSS Grid, Flexbox, Custom Properties (CSS Variables), Media Queries, Animations

#### **Vanilla JavaScript (ES6+)**
- **Purpose**: Application logic without framework overhead
- **Rationale**: Lightweight, direct DOM manipulation, no build step required
- **Key Features**: Modules (import/export), async/await, Classes, Arrow functions, Destructuring

#### **Chart.js / Lightweight Charting Library**
- **Purpose**: Portfolio and price visualization
- **Rationale**: Simple API, responsive, and lightweight for real-time updates

#### **LocalStorage API**
- **Purpose**: Client-side data persistence
- **Rationale**: No backend required for MVP, instant read/write, user-specific portfolios

---

## 📄 Detailed File Engineering Purpose

### **Root Files**

| File | Purpose |
|------|---------|
| `index.html` | Landing page with login/register forms. Entry point for unauthenticated users. Handles initial authentication UI. |
| `dashboard.html` | Main application interface. Contains portfolio overview, trading panels, asset lists, and charts. Accessible post-authentication. |
| `README.md` | Comprehensive project documentation for developers and stakeholders. |

---

### **CSS Directory** (`css/`)

| File | Engineering Purpose |
|------|---------------------|
| `reset.css` | Normalize browser default styles for cross-browser consistency. Removes margins, paddings, and inconsistent element styling. |
| `variables.css` | Centralized design tokens (colors, spacing, font sizes, breakpoints). Single source of truth for theming. Enables easy theme switching. |
| `global.css` | Application-wide base styles: typography hierarchy, utility classes (`.text-center`, `.mt-2`), button base styles, link styles. |
| `auth.css` | Styles specific to authentication pages: centered form layouts, input field styling, login/register card design. |
| `dashboard.css` | Main dashboard layout: grid system for portfolio/trading panels, header navigation, overall page structure. |
| `sidebar.css` | Navigation sidebar component: asset class tabs (Indian Stocks, US Stocks, Crypto), active state indicators, collapse/expand animations. |
| `portfolio.css` | Portfolio overview section: balance display cards, P&L indicators (green/red), holdings table styling. |
| `trading-panel.css` | Buy/sell order form panel: input group styling, quantity selectors, order preview cards, submit button states. |
| `asset-list.css` | Asset table/card components: sortable columns, hover effects, price change indicators, search/filter UI. |
| `charts.css` | Chart container styling: responsive canvas wrappers, legend positioning, chart interaction states. |
| `modal.css` | Modal dialog system: overlay backdrop, modal positioning, close button, animation transitions. |
| `responsive.css` | Media queries for tablets (768px), mobile (480px): collapsible sidebar, stacked layouts, touch-friendly hit areas. |

---

### **JavaScript Directory** (`js/`)

#### **Core Files**

| File | Engineering Purpose |
|------|---------------------|
| `main.js` | Application bootstrap file. Initializes modules, checks authentication status, routes to appropriate view (auth vs dashboard). Sets up global event listeners. |
| `config.js` | Global configuration constants: API endpoints (future), initial balance ($10,000), update intervals, feature flags, asset class definitions. |

#### **Authentication Module** (`js/auth/`)

| File | Engineering Purpose |
|------|---------------------|
| `login.js` | Handles login form submission. Validates credentials against localStorage user registry. Creates session token. Redirects to dashboard on success. |
| `register.js` | Processes new user registration. Validates unique username/email. Initializes user object with $10,000 balance and empty portfolio. Stores in localStorage. |
| `session.js` | Session management utilities: `isLoggedIn()`, `getCurrentUser()`, `logout()`, `setSession()`. Manages session tokens and user context. |

#### **Data Module** (`js/data/`)

| File | Engineering Purpose |
|------|---------------------|
| `indian-stocks.js` | Exports array of Indian stock objects: `{ symbol, name, sector, initialPrice, currency: 'INR' }`. Curated list of ~20-30 NIFTY stocks. |
| `us-stocks.js` | Exports array of US stock objects: `{ symbol, name, sector, initialPrice, currency: 'USD' }`. Selection of major US equities (AAPL, GOOGL, TSLA, etc.). |
| `cryptocurrencies.js` | Exports array of cryptocurrency objects: `{ symbol, name, initialPrice, currency: 'USD' }`. Major cryptos (BTC, ETH, BNB, SOL, DOGE, etc.). |
| `currency-rates.js` | Provides INR to USD conversion utilities. Simulated exchange rate (e.g., 1 USD = 83 INR). Converts Indian stock prices to USD for unified P&L. |

#### **Services Module** (`js/services/`)

| File | Engineering Purpose |
|------|---------------------|
| `market-simulator.js` | **Core Engine**: Simulates real-time price movements. Uses random walk algorithm with volatility parameters. Updates all asset prices at intervals (1-5 seconds). Emits price update events. |
| `portfolio-service.js` | Portfolio CRUD operations: `getPortfolio(userId)`, `addHolding()`, `updateHolding()`, `removeHolding()`. Syncs with localStorage. Returns portfolio state. |
| `trade-executor.js` | Order execution logic: validates funds (buy) or holdings (sell), calculates total cost/proceeds, updates portfolio, deducts/adds to balance, logs transaction. Returns execution result. |
| `pnl-calculator.js` | P&L computation engine: calculates unrealized P&L (current value - cost basis) for each holding. Aggregates total portfolio value. Computes overall P&L % and absolute change. |

#### **UI Module** (`js/ui/`)

| File | Engineering Purpose |
|------|---------------------|
| `dashboard-controller.js` | Main dashboard state manager. Orchestrates all UI updates. Listens to market simulator events. Triggers portfolio recalculation. Coordinates asset list and portfolio display updates. |
| `asset-renderer.js` | Renders asset tables/cards for selected category (Indian/US stocks, crypto). Populates DOM with asset data. Handles sorting, filtering. Attaches buy button event listeners. |
| `portfolio-display.js` | Updates portfolio UI: balance display, holdings table, P&L indicators. Color-codes positive (green) and negative (red) changes. Formats numbers with currency symbols. |
| `trading-form.js` | Manages buy/sell modal forms. Handles quantity input, calculates order preview (total cost). Validates input. Submits to trade executor. Shows success/error notifications. |
| `modal-handler.js` | Generic modal system: `openModal(modalId)`, `closeModal()`, handles overlay clicks, ESC key closing. Manages modal state and transitions. |
| `notification.js` | Toast notification system. Shows success/error/info messages: "Trade executed successfully", "Insufficient funds", etc. Auto-dismiss after 3-5 seconds. |

#### **Charts Module** (`js/charts/`)

| File | Engineering Purpose |
|------|---------------------|
| `portfolio-chart.js` | Renders portfolio value over time (line chart). X-axis: time, Y-axis: total portfolio value in USD. Tracks historical snapshots. Updates periodically. |
| `allocation-chart.js` | Renders asset allocation pie/doughnut chart. Shows distribution: X% Indian Stocks, Y% US Stocks, Z% Crypto. Color-coded by category. |
| `price-chart.js` | (Optional) Individual asset price chart. Shows price history for a selected stock/crypto. Mini-chart in asset detail modal. |

#### **Utils Module** (`js/utils/`)

| File | Engineering Purpose |
|------|---------------------|
| `formatters.js` | Number and currency formatting utilities: `formatCurrency(value, currency)`, `formatPercent(value)`, `formatNumber(value)`. Handles locale-specific formatting (USD vs INR). |
| `validators.js` | Input validation functions: `isValidUsername()`, `isValidEmail()`, `isValidQuantity()`, `isPositiveNumber()`. Returns boolean or error messages. |
| `date-utils.js` | Date/time utilities: `formatTimestamp()`, `getRelativeTime()` (e.g., "2 hours ago"), `getCurrentDate()`. Used for transaction timestamps. |
| `storage.js` | localStorage abstraction layer: `setItem(key, value)`, `getItem(key)`, `removeItem(key)`. Handles JSON serialization/deserialization. Provides error handling. |

---

### **Data Directory** (`data/`)

| File | Engineering Purpose |
|------|---------------------|
| `initial-assets.json` | Complete asset catalog with metadata: symbols, full names, sectors, initial prices, price ranges. Used to seed market simulator. Enables easy asset list updates without code changes. |
| `mock-prices.json` | (Optional) Pre-generated price history for realistic chart initialization. Can be used for backtesting or demo purposes. |

---

### **Assets Directory** (`assets/`)

| Directory/File | Engineering Purpose |
|----------------|---------------------|
| `images/logo.svg` | LetsTrade brand logo (vector for scaling). Used in navbar and login page. |
| `images/hero-bg.jpg` | Landing page hero section background image. Creates visual appeal for unauthenticated users. |
| `images/stock-icon.svg` | Generic stock market icon for UI decoration. |
| `images/crypto-icon.svg` | Cryptocurrency icon for crypto trading section. |
| `icons/indian-stocks/` | Individual icons for major Indian stocks (TCS, Infosys, Reliance). Enhances visual recognition in asset lists. |
| `icons/us-stocks/` | Individual icons for major US stocks (Apple, Google, Tesla). Brand logos for familiarity. |
| `icons/crypto/` | Cryptocurrency logos (Bitcoin, Ethereum, etc.). Official brand assets for authenticity. |

---

### **Docs Directory** (`docs/`)

| File | Engineering Purpose |
|------|---------------------|
| `API.md` | Internal API documentation. Details function signatures, parameters, return values for all service modules. Developer reference. |
| `USER-GUIDE.md` | End-user documentation. Step-by-step instructions for registration, trading, portfolio management. Onboarding resource. |
| `ARCHITECTURE.md` | System architecture deep-dive. Data flow diagrams, state management strategy, future scalability considerations (backend integration). |

---

## 🔧 Development Workflow

### Phase 1: Foundation (Current)
- ✅ Create project structure and README
- ⏳ Build HTML boilerplate for index and dashboard
- ⏳ Establish CSS architecture with variables and reset
- ⏳ Set up JavaScript module structure

### Phase 2: Authentication
- Implement registration and login UI
- Build session management with localStorage
- Create user initialization with $10,000 balance

### Phase 3: Asset Data Layer
- Define curated asset lists (20-30 per category)
- Implement market price simulator
- Build currency conversion utilities

### Phase 4: Trading Engine
- Develop portfolio service with CRUD operations
- Implement trade execution logic with validation
- Build transaction history ledger

### Phase 5: Dashboard UI
- Create portfolio overview with real-time P&L
- Build asset list renderers for all categories
- Implement buy/sell modal forms

### Phase 6: Charts & Analytics
- Integrate Chart.js for portfolio visualization
- Build allocation pie chart
- Create performance tracking over time

### Phase 7: Polish & Optimization
- Responsive design for mobile/tablet
- Animations and transitions
- Error handling and edge cases
- Performance optimization

---

## 🚀 Getting Started

Since this is a client-side only application with no build process:

1. **Clone/Download** the project
2. **Open** `index.html` in a modern browser (Chrome, Firefox, Edge)
3. **Register** a new user account
4. **Start trading** with your $10,000 virtual balance

No installation, no npm, no server required. Pure HTML/CSS/JS.

---

## 📊 Key Technical Decisions

### Why Vanilla JavaScript?
- **Zero dependencies** = faster load times
- **No build process** = instant development feedback
- **Full control** = no framework abstractions to learn
- **Educational value** = understand core web APIs

### Why LocalStorage?
- **No backend complexity** for MVP
- **Instant persistence** without network calls
- **User-specific data** isolated in browser
- **Easy to migrate** to backend API later

### Why Modular CSS?
- **Scalability** = easy to locate and modify styles
- **Reusability** = component-based approach
- **Maintainability** = clear separation of concerns
- **Performance** = can load critical CSS first

### Market Simulation Approach
- **Random Walk Algorithm** with configurable volatility
- **Realistic boundaries** (prevent negative prices, extreme spikes)
- **Asset-specific volatility** (crypto > stocks)
- **Deterministic seeds** for reproducible testing

---

## 🔮 Future Enhancements

- Backend API integration (Node.js + Express + MongoDB)
- Real API data feeds (Alpha Vantage, Binance API)
- Advanced order types (Limit, Stop-Loss)
- Leaderboards and social features
- Mobile app (React Native)
- Webhooks for price alerts
- Tax simulation (capital gains reporting)

---

## 📝 License

MIT License - Free to use for educational purposes.

---

## 👥 Contributors

**Lead Developer**: Senior Frontend Engineer & System Architect  
**Project Owner**: LetsTrade Team

---

**Version**: 1.0.0  
**Last Updated**: March 6, 2026  
**Status**: Foundation Phase - Ready for Development

