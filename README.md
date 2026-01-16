# Crochet

An e-commerce website for handmade crochet goods — fullstack app with a Vite + React frontend and a Node/Express backend.

**Status:** Work in progress

**Tech stack:**
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: Neon 

**Key features**
- Product catalogue and product pages
- Shopping cart and checkout flow
- User authentication and admin dashboard
- Orders view, file uploads (images) via `multer`

**Project structure**
- `backend/` — Express API and server code (`index.js`)
- `frontend/` — React app built with Vite (`src/` contains pages and components)

Getting started
---------------

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (if you plan to use the database features)

1) Clone the repo

```bash
git clone https://github.com/aaship10/Crochet.git
cd Crochet
```

2) Backend

```bash
cd backend
npm install
# start the server (no start script included by default)
node index.js
```

If you prefer an npm script, add a `start` script to `backend/package.json` such as:

```json
"scripts": {
  "start": "node index.js"
}
```

Environment variables
- Create a `.env` in `backend/` and set values used by the server. Typical keys:
  - `DATABASE_URL` — Postgres connection string
  - `JWT_SECRET` — secret for signing JWTs
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — for Google OAuth
  - `PORT` — server port (optional)

3) Frontend (development)

```bash
cd frontend
npm install
npm run dev
```

Build for production

```bash
cd frontend
npm run build
```

Notes
- The backend currently lists dependencies in `backend/package.json` (Express, pg, passport, jwt, bcrypt, multer, etc.). There is no automated test suite configured.
- The frontend scripts are defined in `frontend/package.json` (`dev`, `build`, `preview`).

Contributing
------------
- Open an issue to discuss large changes.
- Send pull requests for bug fixes or features. Keep changes small and focused.
