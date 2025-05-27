# E-Commerce Full Stack Application

A modern, full-stack e-commerce web application built with React, Vite, Zustand, Express.js, MongoDB, Stripe, and more. This project supports user authentication, product management, shopping cart, coupon system, Stripe payments, analytics dashboard, and more.

---

## Deployment

The project is deployed at:  
[https://mern-ecommerce-jd74.onrender.com/](https://mern-ecommerce-jd74.onrender.com/)

You can visit the deployed application to explore all features live.

---

## Features

- User authentication (signup, login, logout, JWT, refresh tokens)
- Admin dashboard for product management and analytics
- Product catalog with categories and featured products
- Shopping cart with quantity management
- Coupon/voucher system (auto-generated on large purchases)
- Stripe integration for secure payments
- Order history and purchase success/cancel pages
- Analytics dashboard (users, sales, revenue, daily stats)
- Responsive UI with Tailwind CSS and Framer Motion
- Toast notifications and loading spinners
- State management with Zustand

---

## Tech Stack

**Frontend:**
- React 19
- Vite
- Zustand (state management)
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Stripe.js

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Stripe API
- Cloudinary (image uploads)
- Redis (Upstash, for refresh tokens and caching)
- dotenv

---

## Project Structure

```
e-commerce/
│
├── backend/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
│
├── .env
├── package.json
├── README.md
└── ...
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB
- Stripe account (for payment integration)
- Cloudinary account (for image uploads)
- Upstash Redis account (for refresh tokens and caching)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
UPSTASH_REDIS_URL=your_upstash_redis_url
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/NematSiddique/mern-ecommerce.git
   cd e-commerce
   ```

2. **Install backend dependencies:**
   ```sh
   npm install
   ```

3. **Install frontend dependencies:**
   ```sh
   cd frontend
   npm install
   cd ..
   ```

### Running the App

**Start the backend server:**
```sh
npm run dev
```

**Start the frontend dev server:**
```sh
cd frontend
npm run dev
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:5173](http://localhost:5173)

---

## Usage

- Visit the frontend URL to browse products, sign up, log in, and shop.
- Admin users can access `/secret-dashboard` for product management and analytics.
- Use the cart and checkout flow to test Stripe payments (use Stripe test cards).
- Coupons are auto-generated for large purchases and can be applied at checkout.

---

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh-token` — Refresh JWT
- `GET /api/auth/profile` — Get current user profile

### Products
- `GET /api/products` — Get all products (admin)
- `GET /api/products/featured` — Get featured products
- `GET /api/products/category/:category` — Get products by category
- `GET /api/products/recommendations` — Get recommended products
- `POST /api/products` — Create product (admin)
- `PATCH /api/products/:id` — Toggle featured (admin)
- `DELETE /api/products/:id` — Delete product (admin)

### Cart
- `GET /api/cart` — Get cart items
- `POST /api/cart` — Add to cart
- `DELETE /api/cart` — Remove from cart
- `PUT /api/cart/:id` — Update quantity

### Coupons
- `GET /api/coupons` — Get user's coupon
- `POST /api/coupons/validate` — Validate coupon

### Payments
- `POST /api/payments/create-checkout-session` — Create Stripe checkout session
- `POST /api/payments/checkout-success` — Handle successful payment

### Analytics (admin)
- `GET /api/analytics` — Get analytics data

---

## Development

- **Linting:**  
  ```sh
  cd frontend
  npm run lint
  ```
- **Build frontend for production:**  
  ```sh
  cd frontend
  npm run build
  ```
- **Production build:**  
  ```sh
  npm run build
  ```

---

## Credits

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Stripe](https://stripe.com/)
- [Cloudinary](https://cloudinary.com/)
- [Upstash Redis](https://upstash.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Happy coding!**
