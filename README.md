<div align="center">
  <img src="frontend/public/favicon.svg" alt="GrabNGo Logo" width="100" style="border-radius: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;" />

  <h1>GrabNGo</h1>

  <p>A modern, minimal full-stack restaurant ordering system that provides a seamless ordering experience for customers and comprehensive management tools for restaurant administrators.</p>

  <p>🔗 <b>Live Demo:</b> <a href="https://grabngo-webapp.vercel.app">grabngo-webapp.vercel.app</a></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## Features

### Customer Features
- ** User Authentication** - Secure registration and login system (Required for access)
- ** Browse Menu** - View restaurant menu with detailed item information
- ** Add to Cart** - Shopping cart functionality with quantity management
- ** Favorites System** - Save favorite menu items for quick access
- ** Order Placement** - Easy checkout and order submission
- ** Order History** - Track current and past orders
- ** Responsive Design** - Optimized for desktop, tablet, and mobile devices

> **Note:** All features except registration and login require user authentication. The application automatically redirects unauthenticated users to the login page.

### Design & Aesthetic
- **Claim Ticket Interface** - The entire app is styled like physical takeaway claim tickets. No bulky shadows or messy 3D effects; just clean lines, dashed separators, and sharp layouts.
- **Paper & Ink Palette** - Utilizes a warm kraft paper background (`#F3EAD9`) with deep ink text (`#241F1A`) and a single, striking red stamp accent (`#D6432E`).
- **Typography** - Built on `Space Mono` for pricing and data to emulate printed receipts, paired with a clean geometric sans-serif for legibility.
- **Micro-interactions** - Frosted glass (`backdrop-filter`) navigation, skeleton loaders that match the ticket shape, and smooth structural transitions without over-animating.

### Admin Features
- **Admin Dashboard** - Comprehensive overview of restaurant operations
- **Menu Management** - Create, edit, update, and delete menu items
- **Order Management** - View and manage customer orders
- **User Management** - Admin panel for user oversight
- **Real-time Updates** - Live order tracking and status updates

### Developer Features
- **API Documentation** - Full OpenAPI/Swagger documentation available at `/api-docs`
- **Docker Support** - Dockerfile included for easy containerized deployment of the backend

## Tech Stack

### Frontend
- **React.js 19** - Modern UI library with hooks
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp.git
cd Kiosks-Restaurant-Ordering-webapp
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and add your environment variables (see Environment Variables section)
cp .env.example .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/restaurant-ordering
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-ordering

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=10000
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret

# Admin Credentials (Optional - for seeding admin user)
ADMIN_EMAIL=user@gmail.com
ADMIN_PASSWORD=123
```

### Frontend (.env or .env.local)

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration (Optional - defaults to localhost:10000 in development)
VITE_API_URL=http://localhost:10000
# For production:
# VITE_API_URL=https://your-backend-url.com

# Razorpay Configuration (use live key in production)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=dpvx0odty
VITE_CLOUDINARY_UPLOAD_PRESET=kiosk-app
```
**Note:** The frontend uses Vite, so all environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

### API Configuration

The frontend is configured to work with the backend API. Update the API base URL in your axios configuration if needed:

```javascript
// In your API configuration file
const API_BASE_URL = import.meta.env.VITE_API_URL ||
 (import.meta.env.MODE === 'production'
 ? 'https://your-backend-url.com'
 : 'http://localhost:10000');
```

## Running the Application

### Development Mode

1. **Start the Backend Server**

```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:10000`

2. **Start the Frontend Development Server**

```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

3. **Access the Application**
 - Frontend: `http://localhost:5173`
 - Backend API: `http://localhost:10000`

### Production Mode

1. **Build the Frontend**

```bash
cd frontend
npm run build
```

2. **Start the Backend**

```bash
cd backend
npm start
```

### Running with Docker

The backend includes a `Dockerfile` for easy containerization and deployment.

1. **Build the Backend Image**
```bash
cd backend
docker build -t grabngo-backend .
```

2. **Run the Container**
```bash
docker run -p 5000:5000 --env-file .env grabngo-backend
```
*Note: Make sure your `.env` file contains the correct `MONGO_URI` and other required variables. If you are running MongoDB locally, you might need to use `host.docker.internal` instead of `localhost`.*

## Project Structure

```
Restaurant-Ordering-Web-App/
│
├── backend/
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── favoritesController.js
│ │ ├── menuController.js
│ │ ├── orderController.js
│ │ └── paymentController.js # Razorpay create + verify
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ ├── MenuItem.js
│ │ ├── Order.js
│ │ └── User.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── favoritesRoutes.js
│ │ ├── menuRoutes.js
│ │ ├── orderRoutes.js
│ │ └── paymentRoutes.js # /api/payments/create-order, /verify
│ ├── public/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── AdminRoute.jsx
│ │ │ ├── BottomNavbar.jsx
│ │ │ └── PrivateRoute.jsx
│ │ ├── pages/
│ │ │ ├── CartPage.jsx
│ │ │ ├── FavoritesPage.jsx
│ │ │ ├── LoginPage.jsx
│ │ │ ├── MenuPage.jsx
│ │ │ ├── OrderHistoryPage.jsx
│ │ │ ├── RegisterPage.jsx
│ │ │ ├── ContactPage.jsx
│ │ │ ├── TermsPage.jsx
│ │ │ ├── PrivacyPage.jsx
│ │ │ ├── ShippingPage.jsx # Razorpay-required policy page
│ │ │ ├── RefundsPage.jsx # Razorpay-required policy page
│ │ │ └── admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── AdminMenuCreatePage.jsx
│ │ │ ├── AdminMenuEditPage.jsx
│ │ │ ├── AdminMenuManager.jsx
│ │ │ └── AdminOrderManager.jsx
│ │ ├── redux/
│ │ │ ├── store.js
│ │ │ └── slices/ (auth, cart, order, favorites, menu, admin, etc.)
│ │ ├── App.jsx
│ │ ├── MainLayout.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── index.html # includes Razorpay checkout script
│ ├── vercel.json
│ └── package.json
└── README.md
```

## Payments (Razorpay – Test Mode)
This app uses Razorpay in **test mode**. To complete a test payment, choose **Wallet → AirtelPaymentsBank** in the Razorpay checkout.

### Flow (simplified)
1. **Create Razorpay order** – Frontend calls `POST /api/payments/create-order` (auth) with `totalPrice`. Backend returns `{ razorpayOrder }`.
2. **Open checkout** – Frontend opens Razorpay Checkout with `order_id = razorpayOrder.id`.
3. **On success** – Razorpay returns `order_id`, `payment_id`, `signature`. Frontend calls `POST /api/payments/verify` (auth) with those plus `orderItems` and `totalPrice`.
4. **Verify & save** – Backend recomputes HMAC with `RAZORPAY_SECRET`. If the signature matches, it saves the order (`paymentStatus: "paid"`, `status: "pending"`). If invalid, it returns 400 and no order is saved.
5. **Failure / cancel** – Razorpay `payment.failed` or modal dismiss triggers an error state on the frontend; loading stops and the cart remains unchanged.

### Notes
- Backend envs: `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`.
- Frontend uses `VITE_RAZORPAY_KEY_ID` in checkout options.
- Orders persist only after successful signature verification.

## API Endpoints

### 📖 Swagger API Documentation
The backend provides interactive API documentation using **Swagger UI**. 

Once the backend server is running, you can view the complete documentation and test endpoints directly from your browser by visiting:
**`http://localhost:10000/api-docs`** (or your respective port, e.g. 5000).

The documentation includes all route schemas, request/response bodies, and supports authentication testing via Bearer token.

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Menu Routes (`/api/menu`)
- `GET /` - Get all menu items
- `GET /:id` - Get specific menu item
- `POST /` - Create menu item (admin only)
- `PUT /:id` - Update menu item (admin only)
- `DELETE /:id` - Delete menu item (admin only)

### Order Routes (`/api/orders`)
- `GET /` - Get user orders (protected)
- `GET /all` - Get all orders (admin only)
- `POST /` - Create new order (protected)
- `PUT /:id/status` - Update order status (admin only)

### Favorites Routes (`/api/favorites`)
- `GET /` - Get user favorites (protected)
- `POST /` - Add item to favorites (protected)
- `DELETE /:menuItemId` - Remove from favorites (protected)

## Authentication & Route Protection

### Authentication Flow
The application implements a secure authentication system using JWT tokens:

1. **Registration/Login** - Users must register or login to access the application
2. **Token Storage** - JWT tokens are stored in localStorage with user information
3. **Protected Routes** - All main application routes are protected and require authentication
4. **Auto-redirect** - Unauthenticated users are automatically redirected to login
5. **Persistent Sessions** - Users remain logged in across browser sessions via localStorage

### Route Protection
- **Public Routes:** `/login`, `/register` - Accessible without authentication
- **Private Routes:** `/` (main app), `/menu`, `/cart`, `/orders`, `/favorites` - Require login
- **Admin Routes:** `/admin/dashboard*` - Require login + admin privileges

### Components
- `PrivateRoute` - Protects customer routes, redirects to login if not authenticated
- `AdminRoute` - Protects admin routes, redirects to login if not authenticated or not admin
- Authentication state managed via Redux with localStorage persistence

## User Roles

### Customer
- Browse menu items
- Add items to cart and favorites
- Place orders
- View order history
- Manage profile

### Admin
- All customer privileges
- Create, edit, and delete menu items
- View and manage all orders
- Access admin dashboard
- Manage user accounts

### Default Admin Credentials
- **Email:** user@gmail.com
- **Password:** 123

*Note: Change these credentials in production*

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel and automatically deploys from the main branch.

### Backend (Railway/Heroku/DigitalOcean)
1. Set up environment variables
2. Configure MongoDB Atlas
3. Deploy using your preferred platform

### Environment Setup for Production
- Update CORS origins in `server.js`
- Set production MongoDB URI
- Configure JWT secrets
- Set proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Shaikh Suja Rahaman**
- GitHub: [@Shaikh-Suja-Rahaman](https://github.com/Shaikh-Suja-Rahaman)

## Support

If you encounter any issues or have questions, please:
1. Check the existing [Issues](https://github.com/Shaikh-Suja-Rahaman/Kiosks-Restaurant-Ordering-webapp/issues)
2. Create a new issue if needed
3. Contact the author

---

 **Star this repository if you found it helpful!** 
