const pool = require('../config/db');
const notificationModel = require('../models/Notification');

const notificationService = {

    // READ - list all notifications of a user
    async getUserNotifications(userId) {
        // $1=userId
        const result = await pool.query(
            `SELECT * FROM ${notificationModel.table} WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    // UPDATE - mark a single notification as read
    async markNotificationAsRead(id, userId) {
        // $1=id, $2=userId (ownership check)
        const result = await pool.query(
            `UPDATE ${notificationModel.table}
             SET is_read = true
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    },

};

module.exports = notificationService;