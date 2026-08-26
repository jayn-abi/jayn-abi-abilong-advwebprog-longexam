Bulldogs Exchange (BulldogEx) is a full-stack marketplace application (Frontend-Backend Integration). The system has three types of accounts: Customer, Supplier, and Admin, with each role having different access to products, orders, reviews, and user management.

abilong-client/ – React (Vite) frontend
abilong-server/ – Express + MongoDB (Mongoose) backend
Client-Server Integration

The client and server communicate through HTTP/JSON. The client runs on port 5173, while the server runs on port 8000. All API requests from the frontend are handled through src/lib/api.js, so the components do not need to call fetch directly.

On the server side, index.js serves as the main entry point. It handles the middleware and routes incoming requests to the appropriate controller. The controller then communicates with the Mongoose models to access or update the database before sending a response back to the client.

For authentication, users can log in or register through /api/users/login or /api/users/register. Once authenticated, the server provides a JWT token together with the user's information. The client stores the token in localStorage and sends it with requests that require authentication. The server then uses the authentication middleware to verify the token and check whether the user has the correct role.

Each side has its own .env file. The server uses MONGO_URI, JWT_SECRET, and PORT, while the client uses VITE_API_URL.


Packages Used:

Server

Express – handles the server and API routes
Mongoose – connects to MongoDB and manages schemas
jsonwebtoken – handles JWT authentication
bcryptjs – encrypts and verifies passwords
cors – allows the frontend to communicate with the backend
dotenv – loads environment variables
nodemon – automatically restarts the server during development

Client

React / React DOM – used to build the user interface
React Router DOM – handles routing and protected pages
Vite – development server and build tool
Tailwind CSS – used for styling
ESLint – helps maintain code quality



Design Patterns

The project follows several design patterns to keep the code organized:

MVC on the server – models/ handles database schemas, controllers/ handles the application logic, and routes/ connects the API endpoints to the controllers.
Middleware Chain – requests pass through middleware such as CORS, JSON parsing, authentication, and role checking before reaching the controller.
Role-Based Access Control (RBAC) – protect checks if a user is authenticated, while restrictTo and adminOnly determine what actions the user can access.
Context for Global State – AuthContext manages authentication information, while CartContext manages the shopping cart.
API Facade – lib/api.js centralizes API requests so components do not directly use fetch.
Route Guards – ProtectedRoute prevents users from accessing pages that are not available to their account type.


File Structure

Server

The system is following an MVC Architecture, wherein we created subfolders for models, controllers, routes, config, and middleware. Each folder contains files related to its specific function, such as database schemas, business logic, API routes, configurations, and authentication.

abilong-server/
├── index.js
├── config/
├── models/
├── controllers/
├── routes/
├── middleware/
└── utils/

Client

Under the client, there are subfolders, namely layouts, context, hooks, lib, components, and pages. These organize the frontend structure, shared states, API connections, reusable components, and pages based on the different user roles.

abilong-client/
└── src/
    ├── App.jsx
    ├── layouts/
    ├── context/
    ├── hooks/
    ├── lib/
    ├── components/
    └── pages/

The pages/folders also represent the different access levels of the system. LandingPages are publicly accessible, while CustomerPages, SupplierPages, and AdminPages are restricted based on the user's role. These restrictions are handled through ProtectedRoute in App.jsx.



