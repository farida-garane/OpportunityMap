const pool = require('../config/db');
const favoriteModel = require('../models/Favorite');

const favoriteService = {

    // READ - list all favorites of a user (joined with opportunity details)
    async getUserFavorites(userId) {
        // $1=userId
        const result = await pool.query(
            `SELECT o.* FROM opportunities o
             INNER JOIN ${favoriteModel.table} f ON f.opportunity_id = o.id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    // CREATE - add an opportunity to favorites
    async addFavorite(userId, opportunityId) {
        // $1=userId, $2=opportunityId
        const result = await pool.query(
            `INSERT INTO ${favoriteModel.table} (user_id, opportunity_id)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, opportunityId]
        );
        return result.rows[0];
    },

    // DELETE - remove an opportunity from favorites
    async removeFavorite(userId, opportunityId) {
        // $1=userId, $2=opportunityId
        const result = await pool.query(
            `DELETE FROM ${favoriteModel.table} WHERE user_id = $1 AND opportunity_id = $2 RETURNING *`,
            [userId, opportunityId]
        );
        return result.rows[0];
    },

};

module.exports = favoriteService;