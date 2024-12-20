import rateLimit from 'express-rate-limit';

export const spotifyApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this client, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}); 