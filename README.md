# Talk Trade - MERN Stack

A full-featured freelance marketplace application built with the MERN stack (MongoDB, Express, React, Node.js).

![Talk Trade](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### For Buyers/Clients
- Browse and search services (gigs)
- Filter by category, price range (in INR), and sort options
- View detailed service information with reviews
- **View comprehensive employee/seller profiles** with:
  - Professional skills and experience
  - Detailed performance ratings
  - Total earnings and completed projects
  - Education and certifications
- Place orders and track order status
- Message sellers directly
- **Leave detailed reviews** with multiple rating parameters
- **Pay in Indian Rupees (₹)** using UPI, Net Banking, Cards, Wallets

### For Sellers/Employees
- Create and manage service listings (gigs)
- **Build comprehensive professional profile** with:
  - Skills, experience, and education
  - Portfolio links and certifications
  - Hourly rate and availability
- Set pricing in INR, delivery time, and revisions
- Manage incoming orders
- Communicate with buyers
- **Track performance metrics**:
  - Total earnings in INR
  - Completed jobs
  - Detailed ratings breakdown
- View earnings and sales analytics

### Core Features
- JWT-based authentication with HTTP-only cookies
- Responsive design with Tailwind CSS (Simple Blue Theme)
- Real-time messaging system
- **Advanced rating and review system** with multiple parameters
- Category-based browsing
- Search functionality
- **Indian Currency (INR) support**
- **Payment integration** (UPI, Net Banking, Cards, Wallets)
- **Comprehensive employee/seller profiles**
- **Detailed performance tracking and analytics**

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **Axios** - HTTP client
- **React Icons** - Icons
- **React Slick** - Carousel component

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## New Features & Enhancements

**See [ENHANCED_FEATURES.md](./ENHANCED_FEATURES.md) for complete details on:**
- Indian Currency (INR) implementation
- Employee/Seller profile enhancements
- Detailed rating system
- Payment methods and transaction tracking
- Professional profile features

---

## Project Structure

```
talk-trade/
├── client/                     # React frontend
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Footer.jsx
│   │   │   ├── GigCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Review.jsx
│   │   │   └── Stars.jsx
│   │   ├── context/            # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── AddGig.jsx
│   │   │   ├── Gig.jsx
│   │   │   ├── Gigs.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── MyGigs.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/              # Utilities
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js backend
│   ├── controllers/            # Route handlers
│   │   ├── auth.controller.js
│   │   ├── conversation.controller.js
│   │   ├── gig.controller.js
│   │   ├── message.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   ├── middleware/             # Middleware
│   │   ├── jwt.js
│   │   └── upload.js
│   ├── models/                 # Mongoose schemas
│   │   ├── conversation.model.js
│   │   ├── gig.model.js
│   │   ├── message.model.js
│   │   ├── order.model.js
│   │   ├── review.model.js
│   │   └── user.model.js
│   ├── routes/                 # API routes
│   │   ├── auth.route.js
│   │   ├── conversation.route.js
│   │   ├── gig.route.js
│   │   ├── message.route.js
│   │   ├── order.route.js
│   │   ├── review.route.js
│   │   └── user.route.js
│   ├── uploads/                # File uploads
│   ├── utils/
│   │   └── createError.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Quick Start (Local Development)

### Quick Start (Recommended)

1. **Setup** (first time only):
   ```bash
   setup.bat
   ```

2. **Update MongoDB connection**:
   - Open `server\.env`
   - Replace with your MongoDB Atlas connection string

3. **Launch the app**:
   ```bash
   start.bat
   ```

4. **Access locally**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 🚀 Deploy Online (Get a Public URL)

**Want a single URL to access from anywhere?**

Follow the deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Recommended: Deploy to Render (Free)**
- Step-by-step guide: [deployment/RENDER.md](./deployment/RENDER.md)
- Get a URL like: `https://talktrade.onrender.com`
- Share with anyone, access from anywhere!

### Quick Deployment Steps:
1. Push code to GitHub
2. Deploy backend to Render (5 min)
3. Deploy frontend to Render (5 min)
4. Get your public URL: `https://talktrade.onrender.com`

Detailed instructions in the deployment folder.

---

1. **Run the automated setup script**
   ```bash
   setup.bat
   ```
   This will install all dependencies for both frontend and backend.

2. **Configure your database**
   - Edit `server/.env` and update the `MONGO_URI` with your MongoDB connection string

3. **Start the application**
   ```bash
   start.bat
   ```
   This will launch both backend and frontend servers automatically.

### Manual Setup

1. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Configure environment variables**
   
   Update the `server/.env` file with your MongoDB connection:
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/talktrade?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

4. **Start backend server**
   ```bash
   cd server
   npm run dev
   ```
   Backend API: http://localhost:5000

5. **Start frontend server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Frontend App: http://localhost:5173

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gigs` | Get all gigs (with filters) |
| GET | `/api/gigs/single/:id` | Get single gig |
| GET | `/api/gigs/mygigs` | Get logged-in seller's gigs |
| POST | `/api/gigs` | Create new gig |
| DELETE | `/api/gigs/:id` | Delete gig |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id` | Mark order complete |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/:gigId` | Get gig reviews |
| POST | `/api/reviews` | Create review |
| DELETE | `/api/reviews/:id` | Delete review |

### Conversations & Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get user's conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/messages/:id` | Get conversation messages |
| POST | `/api/messages` | Send message |

## Categories

- Graphics & Design
- Digital Marketing
- Writing & Translation
- Video & Animation
- Programming & Tech
- Business
- Music & Audio
- AI Services

## Screenshots

### Home Page
The landing page features a hero section with search, category cards, popular services carousel, and testimonials.

### Gigs Listing
Browse services with filters for category, price range, and sorting options.

### Gig Detail
View complete gig information, seller profile, reviews, and order options.

### Dashboard
Sellers can manage their gigs, view orders, and track performance.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Access the Application

Once both servers are running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Acknowledgments

- Modern freelance marketplace platform
- Built with MERN stack
- Simple and clean blue theme design
