# MERN Authentication System

A complete, production-ready full-stack authentication system built with **MongoDB**, **Express**, **React**, and **Node.js**.

---

## 🚀 Architecture & Features

- **JWT Dual Token Authentication**:
  - **Access Token**: Short-lived token stored securely in frontend memory.
  - **Refresh Token**: Long-lived token stored in a secure `HttpOnly`, `SameSite` cookie.
  - **Session Capping**: Active sessions are automatically capped at a maximum of 5 active refresh tokens per user in MongoDB.
- **Route Protection**:
  - `ProtectedRoute`: Restricts access to authenticated routes (e.g., `/dashboard`).
  - `GuestRoute`: Redirects logged-in users away from public auth pages (`/login`, `/signup`).
- **State Management**: Consolidated Context API (`AuthContext`) managing user state and access tokens with automatic silent session restoration on app boot.
- **Axios Interceptors**: Automatic token injection (`Bearer`) and transparent token refresh retries on `401 Unauthorized` responses.
- **Form Validation & Security**: Input validation via `express-validator` and password hashing with `bcrypt`.

---

## 🛠️ Technology Stack

| Layer                  | Technology                                                  |
| :--------------------- | :---------------------------------------------------------- |
| **Backend Framework**  | Node.js, Express 5                                          |
| **Database**           | MongoDB, Mongoose                                           |
| **Frontend Framework** | React 19, Vite                                              |
| **Routing**            | React Router v7                                             |
| **HTTP Client**        | Axios                                                       |
| **Security & Auth**    | JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cookie-parser` |

---

## 📁 Repository Structure

```text
Auth System/
├── auth-backend/
│   ├── src/
│   │   ├── config/          # Database & environment configurations
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, and error handling middleware
│   │   ├── models/          # Mongoose schemas (User model)
│   │   ├── repositories/    # Database query abstraction layer
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # JWT, error, and response utilities
│   │   └── validators/      # express-validator schemas
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Server entry point
│
└── auth-frontend/
    ├── src/
    │   ├── api/             # Axios instance & token manager
    │   ├── components/      # ProtectedRoute & GuestRoute components
    │   ├── context/         # AuthContext & useAuth hook
    │   ├── pages/           # Login, Register, & Dashboard pages
    │   └── services/        # API service calls
    ├── .env                 # Frontend environment variables
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Environment Variables Setup

### Backend (`auth-backend/.env`)

```env
PORT=
NODE_ENV=
MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES=
REFRESH_TOKEN_EXPIRES=

CLIENT_URL=
```

### Frontend (`auth-frontend/.env`)

```env
VITE_API_URL=
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd auth-backend
npm install
npm run dev
```

The backend server will run at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd auth-frontend
npm install
npm run dev
```

The frontend dev server will run at `http://localhost:5173`.

---

## 📡 API Reference

| Method | Endpoint            | Description                         | Auth Required |
| :----- | :------------------ | :---------------------------------- | :------------ |
| `POST` | `/api/auth/signup`  | Register a new user                 | No            |
| `POST` | `/api/auth/login`   | Authenticate user & issue tokens    | No            |
| `POST` | `/api/auth/refresh` | Issue new access token via cookie   | Cookie        |
| `GET`  | `/api/auth/me`      | Retrieve authenticated user profile | Bearer Token  |
| `POST` | `/api/auth/logout`  | Clear refresh token & session       | Cookie        |
