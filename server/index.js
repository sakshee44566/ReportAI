import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/reportai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    // Create a test user if it doesn't exist
    try {
      const testUser = await User.findOne({ email: 'sakshee2022@vitbhopal.ac.in' });
      if (!testUser) {
        const hashedPassword = await bcrypt.hash('password123', 12);
        const newUser = new User({
          name: 'Test User',
          email: 'sakshee2022@vitbhopal.ac.in',
          password: hashedPassword
        });
        await newUser.save();
        console.log('Test user created successfully');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Conversation Schema
const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['single', 'compare'], default: 'single' },
  context: {
    documentText: { type: String },
    leftText: { type: String },
    rightText: { type: String },
    differencesText: { type: String }
  },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

conversationSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });
const Conversation = mongoose.model('Conversation', conversationSchema);

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile (protected route)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Analyze PDF with Gemini
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured on server' });
    }

    // Extract text from PDF
    const parsed = await pdfParse(req.file.buffer);
    const pdfText = parsed.text?.slice(0, 20000) || '';

    // Call Gemini with strict JSON instruction to keep UI clean
    const prompt = `You are a helpful analyst.
Summarize the following report and return STRICT JSON ONLY with the shape:
{"summary": string, "keyPoints": string[], "confidence": number}
- Do not include markdown, code fences, or extra text.
- Keep summary <= 120 words.
- Provide up to 5 concise keyPoints.
- confidence is a float between 0 and 1.

Report text:\n\n${pdfText}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ message: 'Gemini API error', details: data });
    }

    let modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown fences and language hints like ```json
    modelText = modelText.trim();
    if (modelText.startsWith('```')) {
      modelText = modelText.replace(/^```[a-zA-Z]*\n/, '').replace(/```\s*$/, '').trim();
    }
    // If extra text surrounds JSON, try to extract the first JSON object
    if (!(modelText.startsWith('{') && modelText.endsWith('}'))) {
      const match = modelText.match(/\{[\s\S]*\}/);
      if (match) modelText = match[0];
    }

    let analysis;
    try {
      analysis = JSON.parse(modelText);
    } catch {
      // Fallback: derive key points from bullet-like lines
      const lines = modelText.split(/\r?\n/);
      const bullets = lines
        .map(l => l.trim())
        .filter(l => /^[-•\*]/.test(l))
        .map(l => l.replace(/^[-•\*]\s*/, ''))
        .slice(0, 5);
      analysis = {
        summary: modelText.replace(/```[\s\S]*?```/g, '').substring(0, 600) || 'Summary unavailable.',
        keyPoints: bullets,
        confidence: 0.6,
      };
    }

    // Ensure schema completeness
    if (!Array.isArray(analysis.keyPoints)) analysis.keyPoints = [];
    analysis.keyPoints = analysis.keyPoints.filter(Boolean).slice(0, 5);
    if (typeof analysis.confidence !== 'number') analysis.confidence = 0.6;

    // Return parsed analysis and store minimal session text for chat
    res.json({ analysis, documentText: pdfText.slice(0, 50000) });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ message: 'Failed to analyze document' });
  }
});

// Simple chat endpoint using Gemini with context
app.post('/api/chat', async (req, res) => {
  try {
    const { question, documentText } = req.body || {};
    if (!question || !documentText) {
      return res.status(400).json({ message: 'question and documentText are required' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured on server' });
    }

    const prompt = `Answer the user question using ONLY the provided document. If unknown, say you don't know. Return a concise answer.\n\nDocument:\n${documentText.slice(0, 50000)}\n\nQuestion: ${question}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ message: 'Gemini API error', details: data });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate an answer.';
    res.json({ answer });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Failed to get answer' });
  }
});

// Analyze two PDFs and return key differences
app.post('/api/analyze-compare', upload.fields([
  { name: 'fileA', maxCount: 1 },
  { name: 'fileB', maxCount: 1 },
]), async (req, res) => {
  try {
    const fileA = req.files?.fileA?.[0];
    const fileB = req.files?.fileB?.[0];
    if (!fileA || !fileB) {
      return res.status(400).json({ message: 'Two PDF files (fileA, fileB) are required' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured on server' });
    }

    const [parsedA, parsedB] = await Promise.all([
      pdfParse(fileA.buffer),
      pdfParse(fileB.buffer),
    ]);
    const leftText = (parsedA.text || '').slice(0, 40000);
    const rightText = (parsedB.text || '').slice(0, 40000);

    const prompt = `Compare the two reports and return STRICT JSON ONLY with shape:\n{"summary": string, "keyDifferences": string[], "confidence": number}\n- No markdown or code fences.\n- Keep summary <= 120 words.\n- Provide 3-7 concise keyDifferences focusing on changes in numbers, conclusions, scope, and timelines.\n- confidence is 0..1.\n\nReport A:\n${leftText}\n\nReport B:\n${rightText}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ message: 'Gemini API error', details: data });
    }
    let modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    modelText = modelText.trim();
    if (modelText.startsWith('```')) {
      modelText = modelText.replace(/^```[a-zA-Z]*\n/, '').replace(/```\s*$/, '').trim();
    }
    if (!(modelText.startsWith('{') && modelText.endsWith('}'))) {
      const match = modelText.match(/\{[\s\S]*\}/);
      if (match) modelText = match[0];
    }
    let comparison;
    try {
      comparison = JSON.parse(modelText);
    } catch {
      // Fallback if parsing fails
      const lines = modelText.split(/\r?\n/).map(l => l.trim());
      const diffs = lines.filter(l => /^[-•\*]/.test(l)).map(l => l.replace(/^[-•\*]\s*/, '')).slice(0, 7);
      comparison = {
        summary: modelText.substring(0, 600) || 'Comparison summary unavailable.',
        keyDifferences: diffs,
        confidence: 0.6,
      };
    }
    if (!Array.isArray(comparison.keyDifferences)) comparison.keyDifferences = [];
    comparison.keyDifferences = comparison.keyDifferences.filter(Boolean).slice(0, 7);
    if (typeof comparison.confidence !== 'number') comparison.confidence = 0.6;

    const differencesText = `Summary of differences: ${comparison.summary}\nKey differences:\n- ${comparison.keyDifferences.join('\n- ')}`;

    res.json({ comparison, leftText, rightText, differencesText });
  } catch (err) {
    console.error('Analyze-compare error:', err);
    res.status(500).json({ message: 'Failed to analyze comparison' });
  }
});

// Chat about differences using both documents and extracted differences
app.post('/api/chat-compare', async (req, res) => {
  try {
    const { question, leftText, rightText, differencesText } = req.body || {};
    if (!question || !leftText || !rightText) {
      return res.status(400).json({ message: 'question, leftText, and rightText are required' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured on server' });
    }

    const prompt = `You are comparing two reports. Answer the user question using the differences and original texts. If unknown, say you don't know. Be concise.\n\nDifferences:\n${(differencesText || '').slice(0, 2000)}\n\nReport A:\n${leftText.slice(0, 30000)}\n\nReport B:\n${rightText.slice(0, 30000)}\n\nQuestion: ${question}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ message: 'Gemini API error', details: data });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate an answer.';
    res.json({ answer });
  } catch (err) {
    console.error('Chat-compare error:', err);
    res.status(500).json({ message: 'Failed to get answer' });
  }
});

// Conversations CRUD
app.post('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const { title, type = 'single', context, initialMessages = [] } = req.body || {};
    if (!title) return res.status(400).json({ message: 'title is required' });
    const convo = new Conversation({ userId: req.user.userId, title, type, context: context || {}, messages: initialMessages });
    await convo.save();
    res.status(201).json({ id: convo._id.toString() });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const items = await Conversation.find({ userId: req.user.userId }).select('_id title type createdAt updatedAt').sort({ updatedAt: -1 }).limit(100);
    res.json(items.map(i => ({ id: i._id.toString(), title: i.title, type: i.type, createdAt: i.createdAt, updatedAt: i.updatedAt })));
  } catch (err) {
    console.error('List conversations error:', err);
    res.status(500).json({ message: 'Failed to list conversations' });
  }
});

app.get('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const convo = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    res.json({ id: convo._id.toString(), title: convo.title, type: convo.type, context: convo.context, messages: convo.messages, createdAt: convo.createdAt, updatedAt: convo.updatedAt });
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ message: 'Failed to get conversation' });
  }
});

app.post('/api/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { role, content, paired } = req.body || {};
    const convo = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    if (Array.isArray(paired)) {
      convo.messages.push(...paired.map(m => ({ role: m.role, content: m.content })));
    } else if (role && content) {
      convo.messages.push({ role, content });
    } else {
      return res.status(400).json({ message: 'role/content or paired messages required' });
    }
    await convo.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Append message error:', err);
    res.status(500).json({ message: 'Failed to append message' });
  }
});

app.patch('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body || {};
    const convo = await Conversation.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { $set: { title } }, { new: true });
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    res.json({ id: convo._id.toString(), title: convo.title });
  } catch (err) {
    console.error('Rename conversation error:', err);
    res.status(500).json({ message: 'Failed to update conversation' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 