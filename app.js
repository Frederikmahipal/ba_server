import { connectDB } from './db/db.js';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import userRoutes
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = 4000;

connectDB();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true, // Allow cookies to be sent
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes); // Use userRoutes

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});