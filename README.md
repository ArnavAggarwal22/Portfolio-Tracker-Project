# 🚀 Portfolio Tracker

**A full-stack web app to securely track, analyze, and visualize your stock investments in real time—complete with live market trends and per-user data isolation.**

---

## 🔍 Problem & Solution
Managing investments across multiple brokerages is tedious and fragmented. **Portfolio Tracker** provides a unified dashboard where you can:

- **Add & Remove Stocks**  
  Manage `symbol`, `quantity`, `purchase_price`, and `purchase_date`.

- **Fetch Live Quotes (every 30s)**  
  Get real-time `price`, `daily change (d)`, and `percent change (dp)` via Finnhub.io.

- **View a Portfolio Summary**  
  - **Total Invested**  
  - **Current Value**  
  - **Total Gain/Loss** (absolute & percentage)  
  - **Return on Investment (ROI)**  

- **Explore Live Market Trends**  
  Real-time data on up to 50 U.S. tickers in a sortable table.

---

## 🏗️ Tech Stack

### Frontend
- **React 18** & **React Router v6** for SPA routing  
- **Tailwind CSS** for utility-first styling  
- **lucide-react** for lightweight SVG icons  
- **Axios** with an interceptor to attach JWTs from `localStorage`

### Backend
- **Node.js** & **Express** for RESTful routes & middleware  
- **JWT Authentication** securing all `/api/stocks` endpoints  
- **PostgreSQL** as the primary database  
  - Tables:  
    - `users` (id, email, password_hash)  
    - `stocks` (id, symbol, quantity, purchase_price, purchase_date, user_id)  
  - Parameterized queries to prevent SQL injection  
- **Finnhub.io API** wrappers:  
  - `GET /api/market/symbols` → list of U.S. exchange tickers  
  - `POST /api/market/prices` → batch-quote fetch  

### Database
- **PostgreSQL** (Docker/pgAdmin)  
- Normalized schema with foreign keys; index on `(user_id, created_at)`  
### Finance Concepts 
- **Cost Basis & Unrealized Gains**  
 - **ROI (absolute & percentage)**  
 - **Daily Volatility** (`d`, `dp`)  
 - **Currency Formatting** (USD)  
 - **Portfolio Allocation** (future feature)

---

## 🎯 Key Features & Learnings
- **User Isolation:** JWT + `WHERE user_id = $1` for per-user data privacy  
- **Batch Fetching:** Deduplicate symbols client-side; parallel Finnhub calls  
- **Resilient UX:**  
  - Full-screen loading spinners  
  - “N/A” fallbacks for incomplete data  
  - Guarded formatting to avoid runtime errors  
- **Performance Optimizations:**  
  - Smart `useEffect` dependencies  
  - 30-second background refresh  
  - Capped symbol list (limit 50 tickers)
