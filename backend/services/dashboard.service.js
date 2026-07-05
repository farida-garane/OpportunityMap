const pool = require('../config/db');

const dashboardService = {

    // READ - aggregate summary data from multiple tables for one user
    async getUserSummary(userId) {
        // $1=userId (used identically in all 4 queries below)
        const favoritesCount = await pool.query(
            'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
            [userId]
        );

        const myOpportunitiesCount = await pool.query(
            'SELECT COUNT(*) FROM opportunities WHERE created_by = $1',
            [userId]
        );

        const unreadNotificationsCount = await pool.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
            [userId]
        );

        const myOpportunities = await pool.query(
            'SELECT * FROM opportunities WHERE created_by = $1 ORDER BY created_at DESC',
            [userId]
        );

        return {
            favoritesCount: parseInt(favoritesCount.rows[0].count, 10),
            myOpportunitiesCount: parseInt(myOpportunitiesCount.rows[0].count, 10),
            unreadNotificationsCount: parseInt(unreadNotificationsCount.rows[0].count, 10),
            myOpportunities: myOpportunities.rows,
        };
    },

};

module.exports = dashboardService;