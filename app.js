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

const corsOptions = {
    origin: ['http://localhost:5173', 'https://client-sepia-xi-77.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Credentials'
    ]
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Just add trust proxy
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/spotify', spotifyApiLimiter, spotifyRoutes);

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});