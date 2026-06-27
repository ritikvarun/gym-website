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
  settings: {
    gymName: "Muscle Craft Fitness Club",
    logoText: "Muscle Craft",
    heroTitle1: "Transform Your Body.",
    heroTitle2: "Transform Your Life.",
    heroSubheadline: "Expert trainers, cutting-edge equipment, personalized workout plans, and a motivating community designed to help you achieve your fitness goals faster.",
    membersActive: "15k+",
    eliteCoaches: "25+",
    successRate: "99.8%",
    contactEmail: "info@musclecraftgym.com",
    contactPhone: "+1 (555) 000-0000",
    contactAddress: "123 Gym Street, Fitness City"
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
  contactEmail: { type: String, default: "info@musclecraftgym.com" },
  contactPhone: { type: String, default: "+1 (555) 000-0000" },
  contactAddress: { type: String, default: "123 Gym Street, Fitness City" }
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

// CORS configuration - allow admin and frontend origins
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'http://localhost:5174', // Admin Panel local
  // Production Vercel URLs — deploy ke baad yahan apne actual URLs add karo
  'https://musclecraft-gym.vercel.app',
  'https://musclecraft-admin.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (for preview deployments)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow listed origins
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
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
          else resolve(result.secure_url);
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
      return res.json(settings);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const db = readLocalDb();
    res.json(db.settings || defaultDb.settings);
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
    },
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
