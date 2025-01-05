import rateLimit from 'express-rate-limit';

export const spotifyApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP
  message: 'Too many requests from this client, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}); 