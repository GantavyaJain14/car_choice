# 🚗 Car Choice — Premium Used Car Marketplace

**Car Choice** is a modern, interactive, and premium used-car dealership platform designed to connect buyers and sellers seamlessly. With a bold "Ferrari-inspired" UI matching a Red, Black, and White theme, the platform offers a top-tier user experience. 

It handles car listings, complex filtering, image uploads, and seller/admin dashboards, all powered by a robust Next.js frontend and a high-performance FastAPI backend.

---

## 🌟 Key Features

*   **For Buyers:** 
    *   **Advanced Fleet Browsing:** Explore premium vehicles with deep filtering (Make, Model, Year, Fuel Type).
    *   **Enhanced Car Details:** Immersive detail pages with horizontal image galleries and exhaustive technical specifications.
    *   **Direct Inquiry:** Seamless inquiry form for test drives and pricing requests.
*   **For Sellers:** 
    *   **Dynamic Listing Wizard:** A multi-step form with dependent selection logic (Make → Model → Fuel → Variant).
    *   **Mandatory Field Validation:** Enforced data entry to ensure high-quality listings and valid contact information.
*   **For Admins:** 
    *   **Command Depot:** Comprehensive inventory management to add, edit, or delete vehicle listings.
    *   **Dynamic Data Control:** Manage the underlying car database (Brands, Models, Variants) directly from the UI.
    *   **Vehicle Identity:** Integrated Registration tracking for every inventory asset.

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14+ (App Router, React, TailwindCSS)
*   **Animations:** Framer Motion & Lucide React Icons
*   **Backend:** FastAPI (Python 3.10+)
*   **Database:** SQLAlchemy with Async support (SQLite/PostgreSQL)
*   **Storage:** Local media management for vehicle imagery

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [Python](https://www.python.org/) (v3.10+)

### Setting up the Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server (configured for port 8000):
   ```bash
   uvicorn main:app --reload --port 8000
   ```
4. API available at [http://127.0.0.1:8000](http://127.0.0.1:8000). Docs at `/docs`.

### Setting up the Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

---

## 📊 Car Database (`indian_cars_data_updated.json`)
The application uses a comprehensive dataset of Indian automotive brands and models. 
- Integrated dynamic dependent selection logic.
- Admin panel allows real-time updates to this dataset.
- Always use `indian_cars_data_updated.json` for the most recent data structure.

---

## 📄 License
Proprietary and Confidential. © 2026 Car Choice.
