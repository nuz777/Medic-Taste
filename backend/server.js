require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const recipesRoutes = require('./routes/recipes.routes');
const ingredientsRoutes = require('./routes/ingredients.routes');
const plannerRoutes = require('./routes/planner.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const collectionsRoutes = require('./routes/collections.routes');
const shoppingListRoutes = require('./routes/shoppingList.routes');
const statsRoutes = require('./routes/stats.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const suggestionRoutes = require('./routes/suggestion.routes');
const pdfRoutes = require('./routes/pdf.routes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin.trim())) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: origin="${origin}" | allowed=[${allowedOrigins}]`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ message: 'TasteFlow API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/pdf', pdfRoutes);

const { authenticate } = require('./middlewares/authenticate');
app.use('/uploads', authenticate, express.static('uploads'));

app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

app.listen(PORT, async () => {
  console.log(`TasteFlow API corriendo en http://localhost:${PORT}`);
  await testConnection();
});
