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

// ============================================
// Serve Frontend (Static Files)
// ============================================
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/pages')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Fallback to index.html for any other route (useful if we had a SPA router, but still good to have)
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
    } else {
        next(); // For /api routes that aren't found, pass to the error middleware
    }
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