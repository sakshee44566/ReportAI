# ReportAI - AI-Powered Report Analysis

A full-stack web application that uses AI to analyze and compare PDF reports, built with React, Node.js, and MongoDB.

## 🚀 Features

- **PDF Upload & Analysis**: Upload PDF reports and get AI-powered insights
- **AI Chat Interface**: Interactive chat with your documents using Gemini AI
- **Report Comparison**: Compare multiple reports side by side
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for file uploads
- Gemini AI API integration

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Gemini AI API key

## 🔐 Security Setup

**IMPORTANT**: Before running this application, you must configure environment variables to avoid security vulnerabilities.

### 1. Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Get Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for environment configuration

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ReportAI
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment
```bash
cd server
cp env.example .env
```

Edit `.env` with your actual values:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reportai
JWT_SECRET=your_generated_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

#### Client Environment
```bash
cd client
cp .env.example .env
```

Edit `.env` with your server URL:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

#### Production Mode
```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- File upload validation

## 📁 Project Structure

```
ReportAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and API
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── env.example        # Environment template
│   └── package.json
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Deployment

### Environment Variables for Production
- Use strong, unique JWT secrets
- Configure MongoDB Atlas connection
- Set appropriate CORS origins
- Use HTTPS in production

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or any Node.js hosting
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## ⚠️ Security Notes

- Never commit `.env` files
- Regularly rotate JWT secrets
- Monitor API usage and rate limits
- Keep dependencies updated
- Use HTTPS in production

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure MongoDB is running
   - Verify network access

2. **JWT Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **File Upload Errors**
   - Check file size limits
   - Verify file format (PDF only)
   - Check storage permissions

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review environment configuration
3. Open an issue on GitHub

---

**Remember**: Always keep your environment variables secure and never expose them in your code or version control!
