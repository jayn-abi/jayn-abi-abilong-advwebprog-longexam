# Bulldogs Exchange (BulldogEx)

Full-stack marketplace app built for CTADWEBL: Advanced Web Programming — Long Exam 1 (Frontend-Backend Integration). There are three account types — Customer, Supplier, and Admin — and each one has different access to a shared Product/Order/Review/User backend.

- `abilong-client/` — React (Vite) frontend
- `abilong-server/` — Express + MongoDB (Mongoose) backend

## Client-Server Integration

Integrating `abilong-client` (port 5173) with `abilong-server` (port 8000) happens over HTTP/JSON. Every request/response made from the client goes through `src/lib/api.js`, which is the only place in the frontend that actually calls `fetch`.

On the backend, the first point of contact is `index.js`. It runs the request through middleware (cors, express.json, then auth middleware if the route needs it) and finds which route it matches. If none match, it sends a 404. If one matches, the route decides which controller handles it, the controller talks to a Mongoose model, and a JSON response goes back with the right status code.

For login: the client posts credentials to `/api/users/login` or `/api/users/register`, the server checks them and signs a JWT, and sends back `{ token, user }`. The client saves that in `localStorage` and attaches it as `Authorization: Bearer <token>` on every request that needs auth. On the server, `protect` middleware verifies the token, and `restrictTo(...roles)` / `adminOnly` check whether the logged-in user is even allowed to hit that route.

To run it locally:

```bash
cd abilong-server && npm install && npm run dev   # http://localhost:8000
cd abilong-client && npm install && npm run dev   # http://localhost:5173
```

Each side needs its own `.env` — `MONGO_URI`, `JWT_SECRET`, `PORT` for the server, `VITE_API_URL` for the client.

## Packages Used

**Server**
- express — HTTP server and routing
- mongoose — MongoDB connection and schemas
- jsonwebtoken — signs/verifies JWTs for login
- bcryptjs — hashes and checks passwords
- cors — allows the Vite dev server to hit the API
- dotenv — loads `.env` into `process.env`
- nodemon (dev) — auto-restarts the server on save

**Client**
- react / react-dom — UI rendering
- react-router-dom — routing, layouts, protected routes
- vite — dev server and bundler
- tailwindcss — styling
- eslint (dev) — linting

No Redux, no Axios — Context + `fetch` were enough for this size of app.

## Design Patterns

- **MVC on the server** — `models/` for schemas, `controllers/` for logic, `routes/` for wiring endpoints to controllers and middleware.
- **Middleware chain** — every request passes through cors → express.json → protect → role check → controller, and any step can short-circuit with a response.
- **RBAC** — `protect` checks who you are, `restrictTo`/`adminOnly` checks what you're allowed to do. Enforced on both sides: the client hides nav links and redirects for UX, the server enforces it for real.
- **Context for global state** — `AuthContext` and `CartContext` on the client instead of pulling in a state library.
- **API facade** — `lib/api.js` is the only place that builds requests, so components never touch `fetch` directly.
- **Route guards** — `ProtectedRoute` blocks/redirects based on login state and role, mirroring the server's RBAC.

## File Structure

```
abilong-server/
├── index.js            # entry point, middleware, route mounting
├── config/              # env config, constants, db connection
├── models/              # Mongoose schemas (user, product, category, supplier, cart, order, review)
├── controllers/         # business logic per resource
├── routes/               # Express routers, one per resource
├── middleware/
│   └── auth.js           # protect, adminOnly, restrictTo
└── utils/
    └── queryHelpers.js   # pagination/sorting helpers

abilong-client/src/
├── App.jsx               # routes, layouts, protected routes
├── layouts/              # Layout, AuthLayout, AdminLayout
├── context/              # AuthContext, CartContext
├── hooks/
│   └── useAsync.js
├── lib/
│   └── api.js             # fetch wrapper, one *Api object per resource
├── components/            # Button, ProductCard, ProductForm, NavBar, ProtectedRoute, etc.
└── pages/
    ├── LandingPages/       # Home, About, product list/detail
    ├── AuthPages/          # sign in / sign up
    ├── CustomerPages/      # cart, orders, profile
    ├── SupplierPages/      # manage own products
    └── AdminPages/         # manage products, orders, reviews, users
```

The `pages/` folders double as the role map — `AdminPages/` is admin-only, `SupplierPages/` is supplier-only, `LandingPages/` is public — enforced by `ProtectedRoute` in `App.jsx`.
