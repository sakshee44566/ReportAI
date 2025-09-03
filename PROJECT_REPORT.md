# 📊 ReportAI - Project Report

## 🎯 Project Overview

**ReportAI** is a comprehensive full-stack web application that leverages artificial intelligence to analyze and compare PDF reports. Built with modern web technologies, it provides users with intelligent insights, interactive chat capabilities, and advanced document comparison features.

### 🏷️ Project Information
- **Project Name**: ReportAI
- **Version**: 1.0.0
- **License**: MIT
- **Repository**: Available on GitHub
- **Technology Stack**: React, Node.js, MongoDB, Gemini AI

---

## 🚀 Core Features

### 1. **PDF Upload & AI Analysis**
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **File Validation**: Supports PDF files up to 50MB
- **AI-Powered Analysis**: Uses Google's Gemini AI for intelligent document processing
- **Executive Summary**: Automatically generates concise summaries
- **Key Points Extraction**: Identifies and highlights important information
- **Confidence Scoring**: Provides reliability metrics for analysis results

### 2. **Interactive AI Chat Interface**
- **Context-Aware Conversations**: Chat with AI about uploaded documents
- **Real-time Messaging**: Instant responses with typing indicators
- **Conversation History**: Persistent chat sessions with conversation management
- **Smart Suggestions**: Pre-defined questions to help users get started
- **Multi-document Support**: Chat about single documents or comparisons

### 3. **Report Comparison Tool**
- **Side-by-Side Analysis**: Compare two PDF reports simultaneously
- **Difference Detection**: AI identifies key differences between documents
- **Comparative Insights**: Detailed analysis of variations and similarities
- **Visual Progress Tracking**: Real-time progress indicators during processing

### 4. **User Authentication System**
- **Secure Registration**: User account creation with validation
- **JWT Authentication**: Token-based secure login system
- **Password Security**: bcrypt hashing for password protection
- **Session Management**: Persistent login sessions
- **Profile Management**: User profile and account settings

### 5. **Modern User Interface**
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Theme**: Adaptive theming with smooth transitions
- **Component Library**: Built with shadcn/ui components
- **Accessibility**: WCAG compliant interface design
- **Smooth Animations**: Enhanced user experience with micro-interactions

### 6. **Dashboard & Analytics**
- **Usage Statistics**: Track reports analyzed, questions asked, and insights generated
- **Conversation Management**: Organize and access previous chat sessions
- **File Management**: Easy access to uploaded documents and their analyses
- **Progress Tracking**: Visual indicators for upload and processing status

### 7. **Chat Sidebar & Conversation History**
- **Conversation List**: Display all previous chat sessions with timestamps
- **Session Management**: Switch between different conversation threads
- **Context Preservation**: Maintain document context across conversation switches
- **Quick Access**: Easy navigation to previous analyses and comparisons
- **Session Types**: Support for both single document and comparison conversations
- **Persistent Storage**: All conversations saved to database for future access

---

## 🛠️ Technical Architecture

### Frontend Technologies
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality, accessible component library
- **React Router**: Client-side routing for single-page application
- **React Hook Form**: Efficient form handling and validation
- **Zod**: Schema validation for type-safe data handling

### Backend Technologies
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for API development
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcryptjs**: Password hashing and security
- **Multer**: File upload handling middleware
- **pdf-parse**: PDF text extraction library
- **CORS**: Cross-origin resource sharing configuration

### AI Integration
- **Google Gemini AI**: Advanced language model for document analysis
- **RESTful API**: Clean API design for AI service integration
- **Error Handling**: Robust error management for AI service failures
- **Rate Limiting**: API usage optimization and cost management

### Conversation Management System
- **Chat Sidebar Component**: Dedicated UI component for conversation navigation
- **Session Persistence**: MongoDB storage for conversation history
- **Context Switching**: Seamless transition between different document contexts
- **Message Threading**: Organized conversation flow with user and bot messages
- **Real-time Updates**: Live conversation state management

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting and consistency
- **Concurrently**: Parallel development server execution
- **Nodemon**: Automatic server restart during development

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control and repository cloning
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### External Services
- **MongoDB**: 
  - Local installation OR
  - MongoDB Atlas cloud account (free tier available)
- **Google Gemini AI API Key**: 
  - Free account at [Google AI Studio](https://makersuite.google.com/app/apikey)
  - API key for AI-powered document analysis

### Development Environment
- **Code Editor**: VS Code (recommended) or any modern IDE
- **Terminal/Command Prompt**: For running development commands
- **Internet Connection**: Required for AI API calls and package installation

---

## 🚀 Step-by-Step Local Setup Guide

### Step 1: Clone the Repository
```bash
# Clone the repository from GitHub
git clone https://github.com/your-username/ReportAI.git

# Navigate to the project directory
cd ReportAI
```

### Step 2: Install Dependencies

#### Option A: Install All Dependencies at Once
```bash
# Install root, client, and server dependencies
npm run install:all
```

#### Option B: Install Dependencies Separately
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### Step 3: Environment Configuration

#### 3.1 Generate JWT Secret
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Save this generated string** - you'll need it for the environment configuration.

#### 3.2 Get Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

#### 3.3 Configure Server Environment
```bash
# Navigate to server directory
cd server

# Copy the environment template
cp env.example .env
```

Edit the `.env` file with your actual values:
```env
# MongoDB Connection
# For local MongoDB: mongodb://localhost:27017/reportai
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/reportai
MONGODB_URI=mongodb://localhost:27017/reportai

# JWT Secret (use the generated secret from Step 3.1)
JWT_SECRET=your_generated_jwt_secret_here

# Gemini AI API Key (from Step 3.2)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=5000

# Optional: CORS Origins (for production)
CORS_ORIGINS=http://localhost:5173
```

#### 3.4 Configure Client Environment
```bash
# Navigate to client directory
cd ../client

# Create client environment file
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

### Step 4: Database Setup

#### Option A: Local MongoDB Installation
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Update `MONGODB_URI` in server `.env` to: `mongodb://localhost:27017/reportai`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (choose free M0 tier)
3. Create a database user with read/write permissions
4. Configure network access (allow from anywhere for development)
5. Get connection string and update `MONGODB_URI` in server `.env`

### Step 5: Start the Application

#### Development Mode (Recommended)
```bash
# From the root directory, start both frontend and backend
npm run dev
```

This command will:
- Start the backend server on `http://localhost:5000`
- Start the frontend development server on `http://localhost:5173`
- Enable hot reloading for both frontend and backend

#### Alternative: Start Services Separately
```bash
# Terminal 1: Start backend server
npm run dev:server

# Terminal 2: Start frontend client
npm run dev:client
```

### Step 6: Access the Application
- **Frontend Application**: Open `http://localhost:5173` in your browser
- **Backend API**: Available at `http://localhost:5000`
- **API Health Check**: Visit `http://localhost:5000/api/health`

---

## 🔧 Available Scripts

### Root Level Scripts
```bash
npm run install:all    # Install all dependencies
npm run dev           # Start both frontend and backend
npm run dev:client    # Start only frontend
npm run dev:server    # Start only backend
npm run build:client  # Build frontend for production
npm run start:server  # Start backend in production mode
npm run lint          # Run linting on frontend
```

### Client Scripts
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Server Scripts
```bash
cd server
npm start           # Start production server
npm run dev         # Start development server with nodemon
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Document Analysis
- `POST /api/analyze` - Analyze single PDF document
- `POST /api/analyze-compare` - Compare two PDF documents
- `POST /api/chat` - Chat with AI about document
- `POST /api/chat-compare` - Chat about document comparison

### Conversation Management
- `GET /api/conversations` - List user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation details
- `POST /api/conversations/:id/messages` - Add messages to conversation

### Chat Sidebar Features
- **Conversation Listing**: Retrieve all user conversations with metadata
- **Session Selection**: Switch between different conversation contexts
- **Context Restoration**: Restore document analysis state from conversation history
- **Message Persistence**: Save and retrieve conversation messages
- **Type Classification**: Distinguish between single document and comparison conversations

### Health & Monitoring
- `GET /api/health` - Server health check

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Protected Routes**: API endpoints require valid authentication
- **Session Management**: Secure token storage and validation

### Data Protection
- **Environment Variables**: Sensitive data stored in environment files
- **CORS Configuration**: Controlled cross-origin resource sharing
- **File Upload Validation**: Type and size restrictions for uploaded files
- **Input Sanitization**: Protection against injection attacks

### API Security
- **Rate Limiting**: Prevents API abuse and ensures fair usage
- **Error Handling**: Secure error messages without sensitive information
- **Request Validation**: Input validation and sanitization
- **HTTPS Ready**: Production-ready SSL/TLS configuration

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Conversations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  type: String ('single' | 'compare'),
  context: Object,
  messages: [{
    role: String ('user' | 'bot'),
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Sidebar Data Structure
- **Conversation Metadata**: Title, type, creation date for sidebar display
- **Context Preservation**: Document text and analysis data for session restoration
- **Message History**: Complete conversation thread with timestamps
- **User Association**: Linked to authenticated user for privacy and organization
- **Session State**: Current conversation selection and context switching

---

## 🎨 User Interface Features

### Design System
- **Modern Aesthetics**: Clean, professional design with gradient accents
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Component Library**: Consistent UI components using shadcn/ui
- **Accessibility**: WCAG 2.1 AA compliant interface

### User Experience
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy
- **Real-time Feedback**: Loading states, progress indicators, and success messages
- **Error Handling**: User-friendly error messages and recovery options
- **Performance**: Optimized for fast loading and smooth interactions
- **Conversation History**: Sidebar navigation for accessing previous chat sessions
- **Context Awareness**: Smart context switching between different document analyses

### Visual Elements
- **Gradient Backgrounds**: Modern gradient effects and glassmorphism
- **Interactive Elements**: Hover effects, animations, and micro-interactions
- **Icon System**: Consistent iconography using Lucide React
- **Typography**: Clear, readable fonts with proper contrast ratios

---

## 🚀 Deployment Options

### Frontend Deployment
- **Vercel**: Recommended for React applications
- **Netlify**: Alternative static hosting platform
- **GitHub Pages**: Free hosting for public repositories

### Backend Deployment
- **Railway**: Modern platform for Node.js applications
- **Render**: Reliable hosting with automatic deployments
- **Heroku**: Traditional platform-as-a-service option

### Database Hosting
- **MongoDB Atlas**: Cloud database service (recommended)
- **Self-hosted MongoDB**: For advanced users with infrastructure

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# For local MongoDB, ensure service is started
# Windows: Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### 2. Port Already in Use
```bash
# Check what's using the port
lsof -i :5000  # For backend
lsof -i :5173  # For frontend

# Kill the process or change ports in .env files
```

#### 3. API Key Issues
- Verify Gemini API key is correctly set in server `.env`
- Check API key permissions and quotas
- Ensure API key is not expired

#### 4. Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear client dependencies
cd client
rm -rf node_modules package-lock.json
npm install
```

#### 5. CORS Errors
- Update `CORS_ORIGINS` in server `.env` to include your frontend URL
- Ensure frontend and backend are running on correct ports

---

## 📈 Performance Considerations

### Frontend Optimization
- **Code Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed images and optimized bundles
- **Caching**: Browser caching for static assets

### Backend Optimization
- **Connection Pooling**: Efficient database connections
- **File Processing**: Optimized PDF parsing and text extraction
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Error Handling**: Graceful error recovery and logging

### Database Optimization
- **Indexing**: Proper database indexes for fast queries
- **Connection Management**: Efficient connection pooling
- **Data Validation**: Input validation at database level
- **Backup Strategy**: Regular data backups and recovery plans

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add new feature"`
5. Push to your fork: `git push origin feature/new-feature`
6. Create a pull request with detailed description

### Code Standards
- Follow ESLint configuration
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License & Credits

- **License**: MIT License
- **Author**: ReportAI Team
- **Dependencies**: See package.json files for complete dependency list
- **Third-party Services**: Google Gemini AI, MongoDB Atlas

---

## 🆘 Support & Resources

### Documentation
- **README.md**: Main project documentation
- **API Documentation**: Available at `/api/health` endpoint
- **Component Documentation**: shadcn/ui component library docs

### Community
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community discussions and Q&A
- **Wiki**: Additional documentation and guides

### External Resources
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

---

**ReportAI** - Empowering document analysis with artificial intelligence. Built with modern web technologies and designed for scalability, security, and user experience.
