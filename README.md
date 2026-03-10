# Skysail - Premium Flight Booking System

A full-stack flight booking application built with Node.js, Express, MongoDB, and React. Featuring secure JWT authentication, email verification via Mailtrap, and a premium glassmorphism design.

## 🚀 Features

- **Authentication System**:
  - Secure registration and login using JWT.
  - Password hashing with bcrypt.
  - 6-digit email verification code (expires in 10 minutes).
- **Flight Management**:
  - Full CRUD operations for flights.
  - Advanced search with MongoDB filtering (From, To, Date).
  - Dynamic seat availability management.
- **Booking System**:
  - Create and manage bookings.
  - Seat count updates upon booking and cancellation.
  - Private booking history for each user.
- **Premium UI/UX**:
  - Modern Glassmorphism design system.
  - Fully responsive and interactive.
  - Loading states and robust error handling.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Token, Nodemailer, BcryptJS.
- **Frontend**: React (Vite), Axios, React Router, Lucide Icons.
- **Design**: Vanilla CSS with custom design tokens.

## 📦 Getting Started

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account (for the database).
- Mailtrap account (for email testing).

### 2. Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file and fill in your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USER=your_mailtrap_user
   MAIL_PASS=your_mailtrap_pass
   MAIL_FROM=no-reply@skysail.com
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server (development mode with Nodemon):
   ```bash
   npm run dev
   ```

### 3. Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 API Testing (Postman)

A suggested order for testing endpoints:
1. **Auth**: `POST /api/auth/register` (Receive code in Mailtrap).
2. **Verify**: `POST /api/auth/verify` (Send 6-digit code).
3. **Login**: `POST /api/auth/login` (Get JWT).
4. **Flights**: `POST /api/flights` (Add flights manually to test search).
5. **Search**: `GET /api/flights/search?from=City` (Test filters).
6. **Book**: `POST /api/bookings` (Headers: Authorization Bearer [token]).

## 📝 Assignment Requirements Covered

- [x] RESTful API design.
- [x] JWT-based authentication.
- [x] 6-digit email verification with expiration.
- [x] Flight search with MongoDB filtering.
- [x] Protected routes for bookings.
- [x] Available seats management (Update on Book/Cancel).
- [x] Responsive React frontend with all required pages.
- [x] Error and Loading state handling.
