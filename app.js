import { connectDB } from './db/db.js';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import spotifyRoutes from './routes/spotifyRoutes.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { spotifyApiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const port = 4000;

connectDB();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/spotify', spotifyApiLimiter, spotifyRoutes);

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});