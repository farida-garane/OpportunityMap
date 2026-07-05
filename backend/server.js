require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./config/db'); 

const authRoutes = require('./routes/auth.routes');
const opportunityRoutes = require('./routes/opportunity.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const notificationRoutes = require('./routes/notification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// ============================================
// Global middlewares
// ============================================
app.use(cors());
app.use(express.json()); 

// ============================================
// Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.json({ message: 'OpportuniMap API is running.' });
});

// ============================================
// Error handling middleware (always last)
// ============================================
app.use(errorMiddleware);

// ============================================
// Start server
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});