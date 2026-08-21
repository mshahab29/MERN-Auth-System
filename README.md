# MERN Authentication & Authorization System 🔐

A production-grade, full-stack authentication system built with **MongoDB**, **Express**, **React 19**, and **Node.js**.

Designed with **OAuth 2.0 Security Best Practices**, **Dual JWT Token Rotation**, **Google Sign-In**, **Email Verification**, **Password Reset Workflows**, and **Defense-in-Depth Protections**.

---

## 🚀 Key Features

### 🛡️ Authentication & Authorization

- **Dual JWT Token Architecture**:
  - **Access Token**: Short-lived (10m) memory-stored token carrying payload (`id`, `role`).
  - **Refresh Token**: Long-lived (7d) cookie-stored token scoped to `HttpOnly`, `SameSite`, and `path: "/api/auth"`.
- **Refresh Token Rotation & Reuse Detection**:
  - Every refresh token is strictly single-use and rotated on `/refresh`.
  - **Theft / Reuse Revocation**: If a stolen or already-rotated refresh token is presented, the system detects token reuse and **immediately revokes all active sessions** for that user account.
- **Session Capping & Stale Token Pruning**:
  - Automatically caps active user sessions to a maximum of 5.
  - Automatically `$pull`s expired refresh tokens older than 7 days.
- **Instant Access Token Revocation on Password Reset**:
  - Sets `passwordChangedAt` timestamp on password reset.
  - Auth middleware compares JWT `iat` timestamp against `passwordChangedAt` to **instantly revoke all active short-lived access tokens** across all devices.

---

### 📧 Email Verification & Account Safety

- **Email Verification Workflow**:
  - SHA-256 hashed verification tokens with 15-minute expiration timers sent via **Nodemailer**.
  - **Resend Verification Endpoint**: Allows unverified users to request new verification links if their token expires.
  - **Account Enumeration Defense**: Generic response messages on resend and forgot-password endpoints prevent attackers from probing registered email addresses.
  - **Clean Re-Verification Handling**: Repeated clicks on an already-verified link display a clean `Email Already Verified ℹ️` message instead of a generic error.
  - **Unverified Reset Block**: Requires `isVerified === true` before allowing password resets.

---

### 🔑 Google OAuth Integration & Account Linking Defense

- **Google Sign-In & Google Sign-Up**: Integrated with `google-auth-library` (`verifyIdToken`).
- **Google Email Auto-Verification**: Google accounts are automatically marked `isVerified: true`.
- **Account Misconfiguration Protection**: Local login attempts on Google-created accounts (no password set) are caught early with clear guidance: _"This account was created using Google. Please sign in with Google."_

---

### 🔒 Password Strength & Account Privacy

- **Strict Password Complexity**: Minimum 8 characters, requiring uppercase, lowercase, digit, and special symbol (`@$!%*?&`) on both registration and password reset routes.
- **Frontend Password Confirmation**: Client-side password matching checks on signup (`Register.jsx`) and password reset (`ResetPassword.jsx`).
- **Schema Defense-in-Depth**: Sensitive fields (`password`, `verificationToken`, `resetPasswordToken`, `refreshTokens`) set `select: false` on Mongoose schema to prevent accidental logging or exposure.
- **Account Enumeration Defense on Login**: Returns generic HTTP `401 Invalid email or password` for both missing users and wrong passwords.

---

### 🎨 Frontend State Management & UX

- **Consolidated State Management**: Centralized `AuthContext` managing user state, access tokens, and silent session restoration on app load.
- **Axios Interceptors**: Transparent `Bearer` header injection and automatic token refresh retries on `401 Unauthorized` API calls.
- **Route Protection**:
  - `ProtectedRoute`: Secures private pages (e.g. `/dashboard`).
  - `GuestRoute`: Redirects logged-in users away from auth pages (`/login`, `/signup`).

---

## 🛠️ Tech Stack

| Layer               | Technology                                                                         |
| :------------------ | :--------------------------------------------------------------------------------- |
| **Backend**         | Node.js, Express 5                                                                 |
| **Database**        | MongoDB, Mongoose                                                                  |
| **Frontend**        | React 19, Vite, React Router v7                                                    |
| **HTTP Client**     | Axios (Interceptors & Event Handlers)                                              |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `google-auth-library`, `cookie-parser` |
| **Email Service**   | Nodemailer                                                                         |
| **Validation**      | `express-validator`                                                                |

---

## 📁 Repository Structure

```text
Auth System/
├── auth-backend/
│   ├── src/
│   │   ├── config/          # Environment variables & DB connection
│   │   ├── controllers/     # Route controller functions
│   │   ├── middleware/      # Auth, validation, & error handling middleware
│   │   ├── models/          # User Mongoose Schema (select: false defense)
│   │   ├── repositories/    # Database query abstraction layer
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic & email services
│   │   ├── utils/           # JWT, crypto, & Google OAuth helpers
│   │   └── validators/      # express-validator schemas
│   ├── .env
│   ├── package.json
│   └── server.js            # Entry point
│
└── auth-frontend/
    ├── src/
    │   ├── api/             # Axios instance & token manager
    │   ├── components/      # ProtectedRoute, GuestRoute, GoogleLoginButton
    │   ├── context/         # AuthContext provider & hook
    │   ├── pages/           # Login, Register, VerifyEmail, ForgotPassword, ResetPassword, Dashboard
    │   └── services/        # Frontend API call services
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Environment Configuration

### Backend (`auth-backend/.env`)

```env
PORT=5000
NODE_ENV=
MONGODB_URI=mongodb:

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES=10m
REFRESH_TOKEN_EXPIRES=7d

GOOGLE_CLIENT_ID=

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com

CLIENT_URL=http://localhost:5173
```

### Frontend (`auth-frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd auth-backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd auth-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 📡 API Endpoints Reference

| Method | Endpoint                        | Description                      | Auth / Security                   |
| :----- | :------------------------------ | :------------------------------- | :-------------------------------- |
| `POST` | `/api/auth/signup`              | Register a new account           | Password complexity check         |
| `GET`  | `/api/auth/verify-email`        | Verify email address             | SHA-256 token verification        |
| `POST` | `/api/auth/resend-verification` | Resend email verification link   | Account enumeration defense       |
| `POST` | `/api/auth/login`               | Authenticate user & issue tokens | Generic 401, Google account check |
| `POST` | `/api/auth/google-login`        | Authenticate via Google ID Token | Google OAuth ID Token check       |
| `POST` | `/api/auth/google-signup`       | Register via Google ID Token     | Auto email verification           |
| `POST` | `/api/auth/refresh`             | Rotate refresh & access tokens   | Reuse detection & mass revocation |
| `POST` | `/api/auth/logout`              | Clear refresh token & cookie     | Scoped `path: "/api/auth"`        |
| `GET`  | `/api/auth/me`                  | Fetch current user profile       | `Bearer` Access Token required    |
| `POST` | `/api/auth/forgot-password`     | Send password reset link         | Unverified email check            |
| `POST` | `/api/auth/reset-password`      | Reset password using token       | Revokes all refresh/access tokens |
