# ReportAI - AI-Powered Report Analysis Platform

ReportAI is a modern web application that allows users to upload PDF reports and get instant AI-powered analysis, summaries, and answers to questions about their documents.

## 🚀 Features

- **PDF Upload & Analysis**: Upload PDF reports and get instant AI analysis
- **Smart Summaries**: Generate executive summaries and key insights
- **Interactive Chat**: Ask questions about your uploaded documents
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Authentication**: Secure login system (currently bypassed for demo purposes)
- **Real-time Processing**: Get instant results and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (optional - authentication is currently bypassed)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ReportAI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Start the development servers**

   **Terminal 1 - Start the backend server:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection (optional - currently bypassed)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/reportai

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5000
```

## 🎯 Usage

1. **Login**: Enter any email and password (authentication is bypassed for demo)
2. **Upload PDF**: Drag and drop or select a PDF file to upload
3. **Get Analysis**: View AI-generated summaries and key insights
4. **Ask Questions**: Use the chat interface to ask questions about your document
5. **View Stats**: Check your analysis statistics and usage metrics

## 📁 Project Structure

```
ReportAI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── index.js            # Main server file
│   ├── package.json
│   └── env.example         # Environment variables template
├── README.md
└── package.json
```

## 🔐 Authentication

Currently, the authentication system is bypassed for demonstration purposes. You can log in with any email and password combination. The system will:

- Accept any credentials
- Create a mock user session
- Store authentication state in localStorage
- Allow access to all features

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `cd client && npm run build`
2. Deploy the `dist` folder to your preferred platform

### Backend Deployment (Railway/Heroku)
1. Set up environment variables
2. Deploy the `server` folder
3. Update the frontend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from Shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Note**: This is a demo application with bypassed authentication. In a production environment, proper authentication and security measures should be implemented.
