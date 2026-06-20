# The Wizarding Archive

A full-stack catalogue of witches and wizards — a digital conservatory for names, house allegiances, and wand profiles. Built as a React + Vite frontend backed by a Node/Express/MongoDB API, with character portraits stored on Cloudinary.

> *"Our database connects directly to local ministries and registry endpoints to retrieve authenticated profiles. Every entry is displayed in its purest form, devoid of noise, color, or distraction."* — from the Archive's About page

![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

---

## Table of Contents

- [What This Is](#what-this-is)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routing](#pages--routing)
- [Backend API Reference](#backend-api-reference)
- [Design Language](#design-language)
- [Known Quirks](#known-quirks)
- [Tech Stack](#tech-stack)

---

## What This Is

The Wizarding Archive is split into two halves that live in the same repo:

- **`Frontend-b4/`** — a React 19 + Vite single-page app. Editorial, minimal styling (Playfair Display + Inter, ivory and obsidian palette). Handles auth, browsing, and house filtering.
- **`harrypotterbackend/`** — an Express REST API backing the frontend. Handles registration, login, and character CRUD, with images stored on Cloudinary.

The frontend never talks to MongoDB or Cloudinary directly — every request goes through the backend, and the backend is the only thing holding API keys and secrets.

---

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────┐
│   Frontend-b4        │  HTTP   │  harrypotterbackend   │         │   MongoDB   │
│   React + Vite        │ ──────> │  Express API           │ ──────> │   Atlas     │
│   localhost:5173      │ <────── │  localhost:3001        │ <────── │             │
└─────────────────────┘         └──────────────┬───────┘         └─────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────┐
                                         │  Cloudinary │
                                         │  (images)   │
                                         └─────────────┘
```

During development, Vite proxies `/api` and `/auth` requests straight to `http://localhost:3001`, so the frontend can call relative paths like `/auth/login` without worrying about CORS or hardcoding the backend URL.

---

## Project Structure

```
PROJECT/
├── Frontend-b4/
│   ├── src/
│   │   ├── App.jsx              # Root component, auth-gated routing
│   │   ├── Navbar.jsx           # Header + nav links, shows/hides by auth state
│   │   ├── Home.jsx             # Landing page / hero
│   │   ├── Characters.jsx       # Archive grid with house filter
│   │   ├── About.jsx            # Static "philosophy" page
│   │   ├── Login.jsx            # Login form
│   │   ├── Register.jsx         # Registration form
│   │   ├── Products.jsx         # Unused — leftover from a different project
│   │   ├── App.css / index.css  # Editorial theme styling
│   │   └── assets/              # hero.png, icons, etc.
│   ├── public/
│   ├── vite.config.js           # Dev server + API proxy config
│   └── package.json
│
└── harrypotterbackend/
    ├── config/
    │   ├── db.js                 # MongoDB connection
    │   └── cloudinary.js         # Cloudinary SDK setup
    ├── controller/
    │   ├── authController.js     # Register / login logic
    │   └── characterController.js
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification
    ├── models/
    │   ├── Auth.js
    │   └── Character.js
    ├── router/
    │   ├── authRouter.js
    │   └── characterRoute.js
    ├── uploads/                  # Temp storage before Cloudinary push
    ├── .env
    ├── index.js                  # Entry point
    └── package.json
```

---

## Getting Started

You'll need both halves running at once — the frontend on Vite's dev server, the backend on Express.

### 1. Backend

```bash
cd harrypotterbackend
npm install
```

Create `harrypotterbackend/.env`:

```env
PORT=3001
URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/harrypotterdb
JWT_SECRET=your_jwt_secret_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

```bash
npm run dev
```

You should see `Server Started On Port 3001`.

### 2. Frontend

In a separate terminal:

```bash
cd Frontend-b4
npm install
npm run dev
```

Vite will start on its default port (`5173`) and proxy any `/api/*` or `/auth/*` calls to `localhost:3001`.

Open the printed local URL, register an account, log in, and the Archive grid will populate from whatever characters exist in your database.

---

## Environment Variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `PORT` | Backend | Port Express listens on (`3001` expected by the frontend proxy) |
| `URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret used to sign and verify JWTs |
| `CLOUD_NAME` | Backend | Cloudinary cloud name |
| `API_KEY` | Backend | Cloudinary API key |
| `API_SECRET` | Backend | Cloudinary API secret |

The frontend has no `.env` of its own — the proxy target is hardcoded in `vite.config.js`. If you change the backend port, update the `target` values there too.

---

## Pages & Routing

Routing logic lives entirely in `App.jsx` and branches on whether a JWT token exists in `localStorage`.

**Logged out** — only a minimal shell renders, with `/login` and `/register` available. Any other path redirects to `/login`.

**Logged in** — the full shell renders with `Navbar` and a footer. Available routes:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Hero section and a feature card linking into the Archive |
| `/characters` | `Characters` | Grid of characters, filterable by house, pulled from the API |
| `/about` | `About` | Static page describing the Archive's purpose |
| `/login`, `/register` | redirected to `/characters` | Already authenticated, no need to see these again |
| anything else | redirected to `/` | Catch-all |

The token is stored in `localStorage` under the key `token` and sent as a raw value (no `Bearer` prefix) in the `Authorization` header on the `/characters` fetch.

---

## Backend API Reference

Base URL (dev): `http://localhost:3001`

### `POST /auth/register`

```json
{ "name": "Harry Potter", "email": "harry@hogwarts.com", "password": "expelliarmus123" }
```

Returns `201` with the created user, or `400` if the email is already registered.

### `POST /auth/login`

```json
{ "email": "harry@hogwarts.com", "password": "expelliarmus123" }
```

Returns `200` with a JWT token (valid 7 days), or `400` for a missing user / wrong password.

### `POST /api/v1/add/character`

Accepts either a `multipart/form-data` file upload (`name`, `house`, `wand`, `image` file) or a JSON body with a direct image URL. Uploaded files are pushed to Cloudinary; the resulting URL is what gets stored.

### `GET /api/v1/get/characters`

**Protected.** Requires `Authorization: <token>` header. Returns all characters — this is what powers the `/characters` page.

### `GET /api/v1/get/characters/:id`

Public. Returns a single character by ID.

### `PUT /api/v1/update/character/:id`

Updates `name`, `house`, and/or `wand`. Image cannot be changed through this route.

### `DELETE /api/v1/delete/character/:id`

Deletes a character permanently.

> For full request/response examples and error codes, see the dedicated backend API documentation.

---

## Design Language

The frontend follows what its own stylesheet calls an "Editorial Luxury Theme" — Playfair Display for headings, Inter for body text, an ivory-and-obsidian color palette, and deliberately no imagery noise or decorative color. The tone carries through into the copy itself: "Registry Access" instead of "Sign in," "Summoning characters…" as the loading state, characters displayed as "entries" in an "Archive."

---

## Known Quirks

A few things worth knowing if you're picking this codebase up:

- **`Products.jsx` is dead code.** It's a leftover component that fetches from the public Fake Store API and isn't wired into any route. Safe to delete, or safe to ignore.
- **Image path fallback.** `Characters.jsx` checks if `c.image` starts with `http` — if not, it falls back to `http://localhost:3001/${c.image}`, assuming a local upload path rather than a Cloudinary URL. In practice, since the backend always stores the Cloudinary URL, this fallback shouldn't trigger — but it's there.
- **JWT secret.** The backend's `.env` has `JWT_SECRET` properly externalized here (an improvement over earlier versions of this codebase where it was hardcoded) — just make sure your own `.env` isn't committed.
- **Write routes are unauthenticated.** Adding, updating, and deleting characters don't currently require a token — only fetching the full list does. Worth tightening before any public deployment.
- **Local `uploads/` folder isn't cleaned up.** Multer writes the file there before forwarding it to Cloudinary, and nothing deletes it afterward.

---

## Tech Stack

**Frontend**

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI library (v19) |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests (Login/Register) |
| `vite` | Dev server & bundler |

**Backend**

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `cloudinary` / `multer-storage-cloudinary` | Image storage |
| `multer` | Multipart upload handling |
| `dotenv` | Environment config |
