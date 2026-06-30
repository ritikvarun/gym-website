import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import dns from 'dns';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import https from 'https';

// Fix: Windows pe Node.js IPv6 DNS issue — MongoDB SRV resolve ke liye
dns.setDefaultResultOrder('ipv4first');


// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database Connection Flags
let isMongoConnected = false;

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && !MONGO_URI.includes('your_username') && !MONGO_URI.includes('cluster0.xxxx')) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB Atlas successfully.");
      isMongoConnected = true;
    })
    .catch(err => {
      console.error("MongoDB connection error:", err.message);
      console.log("Falling back to local JSON database.");
    });
} else {
  console.log("MongoDB MONGO_URI is not configured in .env. Running in local JSON database mode.");
}

// Cloudinary Configuration
let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  isCloudinaryConfigured = true;
  console.log("Cloudinary configured for image storage.");
} else {
  console.log("Cloudinary is not configured. Images will be saved locally in /uploads.");
}

// Ensure db.json exists with initial data for local fallback mode
const dbPath = path.join(__dirname, 'db.json');
const defaultDb = {
  trainers: [],
  gallery: [],
  classes: [],
  transformations: [],
  leads: [],
  settings: {
    gymName: "Muscle Craft Fitness Club",
    logoText: "Muscle Craft",
    heroTitle1: "Transform Your Body.",
    heroTitle2: "Transform Your Life.",
    heroSubheadline: "Expert trainers, cutting-edge equipment, personalized workout plans, and a motivating community designed to help you achieve your fitness goals faster.",
    membersActive: "15k+",
    eliteCoaches: "25+",
    successRate: "99.8%",
    aboutYears: "12",
    aboutMembers: "8500",
    aboutCoaches: "24",
    contactEmail: "info@musclecraftgym.com",
    contactPhone: "+1 (555) 000-0000",
    contactAddress: "123 Gym Street, Fitness City",
    instagramId: "musclecraftfitness",
    ownerPhone: "8439919640",
    receptionPhone: "",
    basicPrice: "200",
    basicPeriod: "1-Day Trial Pass",
    standardPrice: "8,000",
    standardPeriod: "for 6 months",
    elitePrice: "12,000",
    elitePeriod: "for 1 year",
    aboutPhoto: "",
    estYear: "2014",
    estTagline: "12 Years of Athletic Innovation",
    upiId: "",
    upiName: ""
  }
};

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
}

// Helpers to read/write local DB (Fallback mode)
const readLocalDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultDb;
  }
};

const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {}
};

// ==========================================
// MONGODB SCHEMAS & MODELS
// ==========================================
const settingsSchema = new mongoose.Schema({
  gymName: { type: String, default: "Muscle Craft Fitness Club" },
  logoText: { type: String, default: "Muscle Craft" },
  heroTitle1: { type: String, default: "Transform Your Body." },
  heroTitle2: { type: String, default: "Transform Your Life." },
  heroSubheadline: { type: String, default: "Expert trainers, cutting-edge equipment, personalized workout plans, and a motivating community designed to help you achieve your fitness goals faster." },
  membersActive: { type: String, default: "15k+" },
  eliteCoaches: { type: String, default: "25+" },
  successRate: { type: String, default: "99.8%" },
  aboutYears: { type: String, default: "12" },
  aboutMembers: { type: String, default: "8500" },
  aboutCoaches: { type: String, default: "24" },
  contactEmail: { type: String, default: "info@musclecraftgym.com" },
  contactPhone: { type: String, default: "+1 (555) 000-0000" },
  contactAddress: { type: String, default: "123 Gym Street, Fitness City" },
  instagramId: { type: String, default: "musclecraftfitness" },
  ownerPhone: { type: String, default: "" },
  receptionPhone: { type: String, default: "" },
  basicPrice: { type: String, default: "200" },
  basicPeriod: { type: String, default: "1-Day Trial Pass" },
  standardPrice: { type: String, default: "8,000" },
  standardPeriod: { type: String, default: "for 6 months" },
  elitePrice: { type: String, default: "12,000" },
  elitePeriod: { type: String, default: "for 1 year" },
  aboutPhoto: { type: String, default: "" },
  estYear: { type: String, default: "2014" },
  estTagline: { type: String, default: "12 Years of Athletic Innovation" },
  upiId: { type: String, default: "" },
  upiName: { type: String, default: "" }
});
const SettingsModel = mongoose.model('Settings', settingsSchema);

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  exp: { type: String, required: true },
  certs: [String],
  image: { type: String, required: true },
  accentColor: String,
  badgeBg: String,
  glow: String,
  borderColor: String,
  socials: {
    instagram: { type: String, default: "#" },
    twitter: { type: String, default: "#" }
  }
});
const TrainerModel = mongoose.model('Trainer', trainerSchema);

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  aspect: { type: String, required: true },
  glowColor: { type: String, required: true },
  img: { type: String, required: true }
});
const GalleryModel = mongoose.model('Gallery', gallerySchema);

const programSchema = new mongoose.Schema({
  num: String,
  title: { type: String, required: true },
  desc: { type: String, required: true },
  features: [String],
  iconName: { type: String, default: "FiZap" },
  accent: String,
  textAccent: String,
  glow: String
});
const ProgramModel = mongoose.model('Program', programSchema);

const transformationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  program: { type: String, required: true },
  duration: { type: String, required: true },
  tagline: { type: String, required: true },
  quote: { type: String, required: true },
  accentColor: { type: String, default: '#ccff00' },
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true },
  stats: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
});
const TransformationModel = mongoose.model('Transformation', transformationSchema);

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  plan: { type: String, required: true },
  message: { type: String },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});
const LeadModel = mongoose.model('Lead', leadSchema);

// CORS configuration - allow admin and frontend origins
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'http://127.0.0.1:5173', // Frontend local IP
  'http://localhost:5174', // Admin Panel local
  'http://127.0.0.1:5174', // Admin Panel local IP
  'http://localhost:5175', // Admin Panel local alternative port
  'http://127.0.0.1:5175', // Admin Panel local IP alternative port
  // Production Vercel URLs
  'https://gym-website-pearl-three.vercel.app', // Frontend URL
  'https://gym-website-n5zn.vercel.app',        // Admin URL
  // Custom domains
  'https://www.musclecraftfitnessgym.in',
  'https://musclecraftfitnessgym.in',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (for preview deployments)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow listed origins
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    console.log("❌ Blocked by CORS. Origin was:", origin);
    callback(new Error('Not allowed by CORS'));
  },

  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));

// Multer in-memory storage for Cloudinary stream upload or local buffer write
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload images (to Cloudinary if configured, else locally)
const uploadImage = async (file) => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'gym_customizer' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url ? result.secure_url.replace('/upload/', '/upload/q_auto,f_auto/') : result.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    return `http://localhost:${PORT}/uploads/${filename}`;
  }
};

// ==========================================
// AUTHENTICATION MIDDLEWARE & ENDPOINTS
// ==========================================
// ==========================================
// JWT AUTH MIDDLEWARE
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.adminToken || (authHeader && authHeader.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};

// Admin Login
app.post('/api/auth/adminlogin', (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@musclecraft.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'musclecraft@admin2024';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return res.json({ success: true, token, message: "Logged in successfully" });
  }
  return res.status(401).json({ success: false, message: "Invalid email or password" });
});

// Get Admin Info
app.get('/api/user/getadmin', authMiddleware, (req, res) => {
  return res.json({ success: true, email: req.admin.email, role: 'admin' });
});

// Logout
app.get('/api/auth/logout', (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

// ==========================================
// GYM SETTINGS API
// ==========================================
app.get('/api/settings', async (req, res) => {
  if (isMongoConnected) {
    try {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = await SettingsModel.create(defaultDb.settings);
      }
      const settingsObj = settings.toObject ? settings.toObject() : settings;
      settingsObj.upiId = process.env.UPI_ID || settingsObj.upiId || '';
      settingsObj.upiName = process.env.UPI_NAME || settingsObj.upiName || '';
      return res.json(settingsObj);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    const settingsObj = { ...(db.settings || defaultDb.settings) };
    settingsObj.upiId = process.env.UPI_ID || settingsObj.upiId || '';
    settingsObj.upiName = process.env.UPI_NAME || settingsObj.upiName || '';
    res.json(settingsObj);
  }
});

app.post('/api/settings', authMiddleware, async (req, res) => {
  if (isMongoConnected) {
    try {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel(req.body);
      } else {
        Object.assign(settings, req.body);
      }
      await settings.save();
      return res.json({ success: true, settings });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    db.settings = { ...db.settings, ...req.body };
    writeLocalDb(db);
    res.json({ success: true, settings: db.settings });
  }
});

// Upload About Section Photo
app.post('/api/settings/about-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    const photoUrl = await uploadImage(req.file);
    if (isMongoConnected) {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel({ aboutPhoto: photoUrl });
      } else {
        settings.aboutPhoto = photoUrl;
      }
      await settings.save();
      return res.json({ success: true, aboutPhoto: photoUrl });
    } else {
      const db = readLocalDb();
      db.settings = { ...db.settings, aboutPhoto: photoUrl };
      writeLocalDb(db);
      return res.json({ success: true, aboutPhoto: photoUrl });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// TRAINERS API
// ==========================================
app.get('/api/trainers', async (req, res) => {
  if (isMongoConnected) {
    try {
      const trainers = await TrainerModel.find();
      return res.json(trainers);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    res.json(db.trainers || []);
  }
});

app.post('/api/trainers', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, role, exp, certs, instagram, twitter, accentColor, badgeBg, glow, borderColor } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Profile image required" });
  }

  try {
    const imageUrl = await uploadImage(req.file);

    const trainerData = {
      name,
      role,
      exp,
      certs: certs ? JSON.parse(certs) : [],
      image: imageUrl,
      accentColor: accentColor || 'text-neon-lime border-neon-lime/20',
      badgeBg: badgeBg || 'bg-neon-lime/10',
      glow: glow || 'shadow-neon-lime/5 hover:shadow-neon-lime/20',
      borderColor: borderColor || 'group-hover:border-neon-lime/30',
      socials: {
        instagram: instagram || '#',
        twitter: twitter || '#'
      }
    };

    if (isMongoConnected) {
      const trainer = await TrainerModel.create(trainerData);
      res.json({ success: true, trainer });
    } else {
      const db = readLocalDb();
      const newTrainer = { ...trainerData, _id: Date.now().toString() };
      db.trainers.push(newTrainer);
      writeLocalDb(db);
      res.json({ success: true, trainer: newTrainer });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/trainers/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, role, exp, certs, instagram, twitter, accentColor, badgeBg, glow, borderColor } = req.body;

  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    if (isMongoConnected) {
      const trainer = await TrainerModel.findById(id);
      if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

      trainer.name = name || trainer.name;
      trainer.role = role || trainer.role;
      trainer.exp = exp || trainer.exp;
      if (certs) trainer.certs = JSON.parse(certs);
      if (imageUrl) trainer.image = imageUrl;
      trainer.accentColor = accentColor || trainer.accentColor;
      trainer.badgeBg = badgeBg || trainer.badgeBg;
      trainer.glow = glow || trainer.glow;
      trainer.borderColor = borderColor || trainer.borderColor;
      trainer.socials = {
        instagram: instagram || trainer.socials.instagram,
        twitter: twitter || trainer.socials.twitter
      };

      await trainer.save();
      res.json({ success: true, trainer });
    } else {
      const db = readLocalDb();
      const idx = db.trainers.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Trainer not found" });

      const current = db.trainers[idx];
      db.trainers[idx] = {
        ...current,
        name: name || current.name,
        role: role || current.role,
        exp: exp || current.exp,
        certs: certs ? JSON.parse(certs) : current.certs,
        image: imageUrl || current.image,
        accentColor: accentColor || current.accentColor,
        badgeBg: badgeBg || current.badgeBg,
        glow: glow || current.glow,
        borderColor: borderColor || current.borderColor,
        socials: {
          instagram: instagram || current.socials.instagram,
          twitter: twitter || current.socials.twitter
        }
      };
      writeLocalDb(db);
      res.json({ success: true, trainer: db.trainers[idx] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/trainers/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const trainer = await TrainerModel.findByIdAndDelete(id);
      if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });
      res.json({ success: true, message: "Trainer removed successfully" });
    } else {
      const db = readLocalDb();
      const trainer = db.trainers.find(t => t._id === id);
      if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

      // If local uploads delete
      if (trainer.image && trainer.image.includes('/uploads/')) {
        const filename = trainer.image.split('/uploads/')[1];
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }

      db.trainers = db.trainers.filter(t => t._id !== id);
      writeLocalDb(db);
      res.json({ success: true, message: "Trainer removed successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// GALLERY API
// ==========================================
app.get('/api/gallery', async (req, res) => {
  if (isMongoConnected) {
    try {
      const gallery = await GalleryModel.find();
      return res.json(gallery);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    res.json(db.gallery || []);
  }
});

app.post('/api/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, tag, aspect, glowColor } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file required" });
  }

  try {
    const imageUrl = await uploadImage(req.file);

    const galleryData = {
      title: title || 'Gym Session',
      tag: tag || 'Workout',
      aspect: aspect || 'aspect-square',
      glowColor: glowColor || 'group-hover:border-neon-lime/30',
      img: imageUrl
    };

    if (isMongoConnected) {
      const item = await GalleryModel.create(galleryData);
      res.json({ success: true, galleryItem: item });
    } else {
      const db = readLocalDb();
      const newItem = { ...galleryData, _id: Date.now().toString() };
      db.gallery.push(newItem);
      writeLocalDb(db);
      res.json({ success: true, galleryItem: newItem });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const item = await GalleryModel.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });
      res.json({ success: true, message: "Gallery item removed" });
    } else {
      const db = readLocalDb();
      const item = db.gallery.find(g => g._id === id);
      if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });

      if (item.img && item.img.includes('/uploads/')) {
        const filename = item.img.split('/uploads/')[1];
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }

      db.gallery = db.gallery.filter(g => g._id !== id);
      writeLocalDb(db);
      res.json({ success: true, message: "Gallery item removed" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// CLASSES/PROGRAMS API
// ==========================================
app.get('/api/programs', async (req, res) => {
  if (isMongoConnected) {
    try {
      const classes = await ProgramModel.find().sort({ num: 1 });
      return res.json(classes);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    res.json(db.classes || []);
  }
});

app.post('/api/programs', authMiddleware, async (req, res) => {
  const { title, desc, features, iconName, accent, textAccent, glow } = req.body;

  try {
    let currentLength = 0;
    if (isMongoConnected) {
      currentLength = await ProgramModel.countDocuments();
    } else {
      const db = readLocalDb();
      currentLength = db.classes.length;
    }

    const programData = {
      num: String(currentLength + 1).padStart(2, '0'),
      title,
      desc,
      features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
      iconName: iconName || 'FiZap',
      accent: accent || 'group-hover:border-neon-lime',
      textAccent: textAccent || 'text-neon-lime',
      glow: glow || 'shadow-neon-lime/5 group-hover:shadow-neon-lime/15'
    };

    if (isMongoConnected) {
      const newClass = await ProgramModel.create(programData);
      res.json({ success: true, program: newClass });
    } else {
      const db = readLocalDb();
      const newClass = { ...programData, _id: Date.now().toString() };
      db.classes.push(newClass);
      writeLocalDb(db);
      res.json({ success: true, program: newClass });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/programs/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, desc, features, iconName, accent, textAccent, glow } = req.body;

  try {
    if (isMongoConnected) {
      const prog = await ProgramModel.findById(id);
      if (!prog) return res.status(404).json({ success: false, message: "Program not found" });

      prog.title = title || prog.title;
      prog.desc = desc || prog.desc;
      if (features) prog.features = Array.isArray(features) ? features : JSON.parse(features);
      prog.iconName = iconName || prog.iconName;
      prog.accent = accent || prog.accent;
      prog.textAccent = textAccent || prog.textAccent;
      prog.glow = glow || prog.glow;

      await prog.save();
      res.json({ success: true, program: prog });
    } else {
      const db = readLocalDb();
      const idx = db.classes.findIndex(c => c._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Program not found" });

      const current = db.classes[idx];
      db.classes[idx] = {
        ...current,
        title: title || current.title,
        desc: desc || current.desc,
        features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : current.features,
        iconName: iconName || current.iconName,
        accent: accent || current.accent,
        textAccent: textAccent || current.textAccent,
        glow: glow || current.glow
      };
      writeLocalDb(db);
      res.json({ success: true, program: db.classes[idx] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/programs/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const prog = await ProgramModel.findByIdAndDelete(id);
      if (!prog) return res.status(404).json({ success: false, message: "Program not found" });

      // Recalculate numbers in Mongo
      const allProgs = await ProgramModel.find().sort({ num: 1 });
      for (let i = 0; i < allProgs.length; i++) {
        allProgs[i].num = String(i + 1).padStart(2, '0');
        await allProgs[i].save();
      }

      res.json({ success: true, message: "Program removed successfully" });
    } else {
      const db = readLocalDb();
      const prog = db.classes.find(c => c._id === id);
      if (!prog) return res.status(404).json({ success: false, message: "Program not found" });

      db.classes = db.classes.filter(c => c._id !== id);
      // Recalculate numbers
      db.classes = db.classes.map((c, index) => ({
        ...c,
        num: String(index + 1).padStart(2, '0')
      }));
      writeLocalDb(db);
      res.json({ success: true, message: "Program removed successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// TRANSFORMATIONS API
// ==========================================
app.get('/api/transformations', async (req, res) => {
  if (isMongoConnected) {
    try {
      const transformations = await TransformationModel.find();
      return res.json(transformations);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    res.json(db.transformations || []);
  }
});

app.post('/api/transformations', authMiddleware, upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  const { name, program, duration, tagline, quote, accentColor, stats } = req.body;

  if (!req.files || !req.files['beforeImage'] || !req.files['afterImage']) {
    return res.status(400).json({ success: false, message: "Both before and after images are required" });
  }

  try {
    const beforeUrl = await uploadImage(req.files['beforeImage'][0]);
    const afterUrl = await uploadImage(req.files['afterImage'][0]);

    const transformationData = {
      name,
      program,
      duration,
      tagline,
      quote,
      accentColor: accentColor || '#ccff00',
      beforeImage: beforeUrl,
      afterImage: afterUrl,
      stats: stats ? (Array.isArray(stats) ? stats : JSON.parse(stats)) : []
    };

    if (isMongoConnected) {
      const transformation = await TransformationModel.create(transformationData);
      res.json({ success: true, transformation });
    } else {
      const db = readLocalDb();
      const newTransformation = { ...transformationData, _id: Date.now().toString() };
      if (!db.transformations) db.transformations = [];
      db.transformations.push(newTransformation);
      writeLocalDb(db);
      res.json({ success: true, transformation: newTransformation });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/transformations/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const item = await TransformationModel.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, message: "Transformation not found" });
      res.json({ success: true, message: "Transformation removed successfully" });
    } else {
      const db = readLocalDb();
      const item = db.transformations.find(t => t._id === id);
      if (!item) return res.status(404).json({ success: false, message: "Transformation not found" });

      // Clean up files locally if any
      if (item.beforeImage && item.beforeImage.includes('/uploads/')) {
        const filename = item.beforeImage.split('/uploads/')[1];
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }
      if (item.afterImage && item.afterImage.includes('/uploads/')) {
        const filename = item.afterImage.split('/uploads/')[1];
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }

      db.transformations = db.transformations.filter(t => t._id !== id);
      writeLocalDb(db);
      res.json({ success: true, message: "Transformation removed successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// EMAIL NOTIFICATION HELPER
// ==========================================
const sendEmailNotification = async (lead) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailReceiver = process.env.EMAIL_RECEIVER;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!smtpUser && !resendApiKey) {
    console.log("⚠️ SMTP_USER or RESEND_API_KEY not set in environment. Skipping email notification.");
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1f1f23; background-color: #08080a; color: #fff; border-radius: 16px;">
      <div style="text-align: center; border-bottom: 2px solid #ccff00; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #ccff00; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">New Gym Lead Capture</h2>
        <p style="color: #888; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Muscle Craft Fitness Club</p>
      </div>
      <div style="margin-bottom: 25px; padding: 0 10px;">
        <p style="font-size: 15px; line-height: 1.6; color: #ccc;">A new visitor has submitted a lead/trial pass form on the website. Here are the client's details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #0e0e12; border-radius: 12px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #1a1a22;">
            <td style="padding: 14px 16px; color: #888; font-weight: bold; font-size: 12px; text-transform: uppercase; width: 120px;">Full Name:</td>
            <td style="padding: 14px 16px; color: #fff; font-size: 14px; font-weight: bold;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1a1a22;">
            <td style="padding: 14px 16px; color: #888; font-weight: bold; font-size: 12px; text-transform: uppercase;">Phone:</td>
            <td style="padding: 14px 16px; color: #ccff00; font-size: 14px; font-weight: bold;">
              <a href="tel:${lead.phone}" style="color: #ccff00; text-decoration: none;">${lead.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #1a1a22;">
            <td style="padding: 14px 16px; color: #888; font-weight: bold; font-size: 12px; text-transform: uppercase;">Address:</td>
            <td style="padding: 14px 16px; color: #eee; font-size: 14px;">${lead.address}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1a1a22;">
            <td style="padding: 14px 16px; color: #888; font-weight: bold; font-size: 12px; text-transform: uppercase;">Chosen Plan:</td>
            <td style="padding: 14px 16px; color: #ccff00; font-size: 14px; font-weight: bold; text-transform: uppercase;">${lead.plan}</td>
          </tr>
          ${lead.message ? `
          <tr>
            <td style="padding: 14px 16px; color: #888; font-weight: bold; font-size: 12px; text-transform: uppercase; vertical-align: top;">Message:</td>
            <td style="padding: 14px 16px; color: #ccc; font-size: 13px; line-height: 1.5; font-style: italic;">"${lead.message}"</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #1a1a22; padding-top: 20px; margin-top: 20px;">
        <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);">
          Reply on WhatsApp
        </a>
        <p style="font-size: 10px; color: #444; margin-top: 20px; line-height: 1.4;">
          This email was sent automatically from the Muscle Craft Gym server.<br/>
          Database Backup ID: ${lead._id}
        </p>
      </div>
    </div>
  `;

  // 1. If Resend API Key is provided, use Resend HTTP API (Best for Render Free Tier)
  if (resendApiKey && !resendApiKey.includes('re_xxxx')) {
    try {
      console.log("📨 Attempting to send email via Resend HTTP API...");
      await new Promise((resolve, reject) => {
        const postData = JSON.stringify({
          from: 'Gym Leads <onboarding@resend.dev>',
          to: [emailReceiver || smtpUser],
          subject: `🔥 New Web Lead: ${lead.name} [${lead.plan}]`,
          html: htmlContent
        });

        const options = {
          hostname: 'api.resend.com',
          port: 443,
          path: '/emails',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ success: true, body: JSON.parse(body) });
            } else {
              reject(new Error(`Status ${res.statusCode}: ${body}`));
            }
          });
        });

        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
      });

      console.log(`✉️ Resend successfully sent email alert for lead ${lead.name}`);
      return true;
    } catch (error) {
      console.error("❌ Resend API Error:", error.message);
      // Fall through to SMTP if available
      if (!smtpUser || !smtpPass) {
        return false;
      }
    }
  }

  // 2. Fallback to Nodemailer SMTP (For local development or if SMTP is configured)
  if (smtpUser && smtpPass) {
    try {
      console.log("📨 Attempting to send email via Nodemailer SMTP...");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Muscle Craft Web Leads" <${smtpUser}>`,
        to: emailReceiver || smtpUser,
        subject: `🔥 New Web Lead: ${lead.name} [${lead.plan}]`,
        text: `New Lead Notification\n\nName: ${lead.name}\nPhone: ${lead.phone}\nAddress: ${lead.address}\nPlan: ${lead.plan}\nMessage: ${lead.message || 'None'}`,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ Nodemailer successfully sent email alert for lead ${lead.name}`);
      return true;
    } catch (error) {
      console.error("❌ Error occurred in Nodemailer transporter.sendMail:", error.message);
      return false;
    }
  }
};

// ==========================================
// LEADS API
// ==========================================
app.post('/api/leads', async (req, res) => {
  const { name, phone, address, plan, message } = req.body;

  if (!name || !phone || !address || !plan) {
    return res.status(400).json({ success: false, message: "Required fields missing (name, phone, address, plan)" });
  }

  try {
    let savedLead;

    if (isMongoConnected) {
      savedLead = await LeadModel.create({
        name,
        phone,
        address,
        plan,
        message,
        status: 'New'
      });
    } else {
      const db = readLocalDb();
      if (!db.leads) db.leads = [];
      
      savedLead = {
        _id: Date.now().toString(),
        name,
        phone,
        address,
        plan,
        message,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      
      db.leads.push(savedLead);
      writeLocalDb(db);
    }

    // Attempt to send email async so we don't delay client response.
    // If it fails, lead is already safely saved in DB.
    sendEmailNotification(savedLead).catch(err => {
      console.error("Async email sending failed:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      lead: savedLead,
      whatsappNumber: process.env.WHATSAPP_NUMBER || '919876543210'
    });

  } catch (err) {
    console.error("Error saving gym lead:", err);
    res.status(500).json({ success: false, message: "Internal server error occurred while saving lead" });
  }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const leads = await LeadModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, leads });
    } else {
      const db = readLocalDb();
      const leads = db.leads || [];
      // Sort descending by createdAt or _id
      leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, leads });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/leads/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const result = await LeadModel.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ success: false, message: "Lead not found" });
      res.json({ success: true, message: "Lead deleted successfully" });
    } else {
      const db = readLocalDb();
      const initialLength = db.leads ? db.leads.length : 0;
      db.leads = (db.leads || []).filter(lead => lead._id !== id);
      if ((db.leads ? db.leads.length : 0) === initialLength) {
        return res.status(404).json({ success: false, message: "Lead not found" });
      }
      writeLocalDb(db);
      res.json({ success: true, message: "Lead deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ==========================================
// ROOT HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
  res.json({
    status: '✅ Online',
    name: 'Muscle Craft Gym — Backend API',
    version: '1.0.0',
    database: isMongoConnected ? '✅ MongoDB Atlas Connected' : '⚠️ Local JSON Fallback',
    endpoints: {
      settings:        'GET  /api/settings',
      trainers:        'GET  /api/trainers',
      gallery:         'GET  /api/gallery',
      programs:        'GET  /api/programs',
      testimonials:    'GET  /api/testimonials',
      transformations: 'GET  /api/transformations',
      pricing:         'GET  /api/pricing',
      login:           'POST /api/auth/adminlogin',
      logout:          'GET  /api/auth/logout',
      health:          'GET  /api/health'
    },
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    message: "Gym Backend API is Running 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


const server = app.listen(PORT, () => {

  console.log(`Backend server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} already in use!`);
    console.error(`Fix: Run this command → taskkill /F /IM node.exe`);
    console.error(`Then run: npm run dev\n`);
    process.exit(1);
  }
});
