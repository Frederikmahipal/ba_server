import { connectDB } from './db/db.js';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import spotifyRoutes from './routes/spotifyRoutes.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { spotifyApiLimiter } from './middleware/rateLimiter.js';
import session from 'express-session';

dotenv.config();

const app = express();
const port = 4000;

connectDB();

// Important for Vercel
app.set('trust proxy', 1);

const corsOptions = {
    origin: [
        'https://client-sepia-xi-77.vercel.app',
        'https://client-7xd81ltpe-frederiks-projects-6d4123e7.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
};

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Vercel
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        domain: '.vercel.app' // Match your domain
    }
}));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/spotify', spotifyApiLimiter, spotifyRoutes);

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});