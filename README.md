# Feedback System

A real-time feedback collection and management system built with React, Node.js, Express, and MongoDB. This application allows users to submit feedback with star ratings and provides an admin dashboard for viewing and analyzing feedback data.

## 🚀 Features

- **User Feedback Submission**: Submit feedback with star ratings and comments
- **Real-time Updates**: Live feedback updates using Socket.IO
- **Admin Dashboard**: View and analyze feedback with charts and statistics
- **Authentication**: Secure admin login system
- **Responsive Design**: Modern UI that works on all devices
- **Data Visualization**: Charts and graphs for feedback analysis

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd feedback-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/feedback-system
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**Note**: Replace `your_jwt_secret_key_here` with a secure random string.

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGO_URI` in your `.env` file

### 5. Create Admin User

```bash
# Navigate to backend directory
cd backend

# Run the admin creation script
node createAdmin.js
```

This will create an admin user with the following credentials:
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials after first login for security.

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
# In backend directory
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
# In frontend directory
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
# In frontend directory
npm run build
```

#### Start Production Server
```bash
# In backend directory
npm start
```

## 📱 Usage

### For Users

1. **Access the Application**: Open `http://localhost:5173` in your browser
2. **Submit Feedback**: 
   - Rate your experience using the star rating system
   - Add comments in the text area
   - Click "Submit Feedback"
3. **View Confirmation**: You'll be redirected to a thank you page

### For Administrators

1. **Login**: Navigate to `http://localhost:5173/login`
2. **Enter Credentials**: Use the admin username and password
3. **Access Dashboard**: View feedback statistics and data
4. **Real-time Updates**: See new feedback as it comes in

## 📁 Project Structure

```
feedback-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server file
│   ├── createAdmin.js       # Admin user creation script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── stores/          # State management
│   │   └── main.jsx         # Application entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Feedback
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Get all feedback (admin only)
- `GET /api/feedback/stats` - Get feedback statistics (admin only)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the port

3. **Module Not Found Errors**
   - Run `npm install` in both directories
   - Clear node_modules and reinstall

4. **CORS Errors**
   - Check that the frontend URL is allowed in backend CORS settings
   - Verify API endpoint URLs

### Development Tips

- Use `npm run dev` for development with auto-reload
- Check browser console for frontend errors
- Monitor server logs for backend issues
- Use MongoDB Compass for database inspection

## 🚀 Deployment

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import your repository.
2. Set the following environment variables in Vercel project settings:
   - `VITE_API_URL` = `https://<your-render-backend-url>`
   - `VITE_SOCKET_URL` = `https://<your-render-backend-url>`
3. Deploy. Vercel will auto-detect Vite/React and build your app.

### Backend (Render)
1. Go to [Render](https://render.com/) and create a new Web Service from your repo.
2. Set the following environment variables in Render:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your JWT secret
   - `FRONTEND_URL` = `https://<your-vercel-frontend-url>`
3. Render will auto-detect Node.js and start your server on the correct port.

### CORS & Real-time
- Make sure `FRONTEND_URL` in Render matches your deployed Vercel domain.
- Make sure `VITE_API_URL` and `VITE_SOCKET_URL` in Vercel match your Render backend URL (including https).
- For local development, these default to localhost.

### Example .env files
#### backend/.env.example
```
MONGO_URI=mongodb://localhost:27017/feedback-system
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```
#### frontend/.env.example
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Happy Coding! 🎉** 