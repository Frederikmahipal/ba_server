import rateLimit from 'express-rate-limit';

export const spotifyApiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this client, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}); 

