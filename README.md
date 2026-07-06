# Product Catalog CRUD App

A full CRUD product catalog with a FastAPI backend and a React (Vite + Tailwind) frontend. On first run, the backend seeds itself with 100 products from the [DummyJSON](https://dummyjson.com/) API, then persists all further changes locally.

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React, Vite, Tailwind CSS v4, react-hot-toast, lucide-react
- **Data source:** DummyJSON products, fetched once and stored locally so create/update/delete actually persist

## Project layout

```
backend/
  app/
    main.py       FastAPI app + routes
    models.py     SQLAlchemy Product model
    schemas.py    Pydantic request/response schemas
    crud.py       Database operations
    seed.py       One-time seed from DummyJSON
    database.py   SQLite engine/session setup
  requirements.txt
frontend/
  src/
    components/   Navbar, SearchBar, ProductCard, ProductModal, ConfirmDialog, Pagination
    lib/          api.js (fetch client), useDarkMode.js
    App.jsx
```

## Running locally

### Backend

```bash
cd backend
python -m venv venv
./venv/Scripts/activate   # or source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. On first startup it fetches 100 products from DummyJSON into `backend/products.db` (SQLite). Delete that file to re-seed from scratch.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000`, so make sure the backend is running first.

## API endpoints

| Method | Path                        | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/products`             | List products (`skip`, `limit`, `search`, `category`) |
| GET    | `/api/products/categories`  | Distinct category list               |
| GET    | `/api/products/{id}`        | Get one product                      |
| POST   | `/api/products`             | Create a product                     |
| PUT    | `/api/products/{id}`        | Update a product                     |
| DELETE | `/api/products/{id}`        | Delete a product                     |

## Features

- Product grid with images, pricing/discount, ratings, and stock, pulled from DummyJSON
- Debounced search + category filter, with pagination
- Add/Edit modal with client-side validation
- Delete confirmation dialog
- Toast notifications for create/update/delete
- Dark mode toggle (persisted in localStorage)
- Responsive layout (mobile through desktop)
