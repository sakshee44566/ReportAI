# ReportAI with MongoDB Authentication

This project now includes MongoDB integration for user authentication and data storage.

## Features Added

- ✅ User registration with MongoDB storage
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Secure token-based authentication
- ✅ User profile management
- ✅ Persistent login sessions

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

## Setup Instructions

### 1. Install MongoDB

#### Option A: Local MongoDB Installation
- Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` with your MongoDB connection:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/reportai

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reportai

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

This will start both:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

#### Separate Mode
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend-backend communication
- **Error Handling**: Comprehensive error handling and user feedback

## Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access the main application after authentication
4. **Logout**: Securely log out and clear session

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

### Port Conflicts
- Change `PORT` in `.env` if 5000 is occupied
- Update `API_BASE_URL` in `src/lib/api.ts` if needed

### Authentication Issues
- Clear browser localStorage if tokens are corrupted
- Check server logs for detailed error messages

## Production Deployment

1. **Environment Variables**: Set proper `JWT_SECRET` and `MONGODB_URI`
2. **MongoDB Atlas**: Use cloud MongoDB for production
3. **HTTPS**: Enable HTTPS for secure token transmission
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Logging**: Add proper logging for security monitoring

## Development Notes

- Frontend automatically handles token storage in localStorage
- Authentication state is managed through React Context
- All API calls include proper error handling
- User sessions persist across browser refreshes 