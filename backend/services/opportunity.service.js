const pool = require('../config/db');
const opportunityModel = require('../models/Opportunity');

const opportunityService = {

    // READ - list all opportunities (with optional filters: type, field, city)
    async getAllOpportunities({ type, field, city }) {
        let query = `SELECT * FROM ${opportunityModel.table} WHERE 1=1`;
        const values = [];

        // Each filter adds its value to the list and gets the next $ number automatically
        if (type) {
            values.push(type);
            query += ` AND type = $${values.length}`;
        }
        if (field) {
            values.push(field);
            query += ` AND field = $${values.length}`;
        }
        if (city) {
            values.push(city);
            query += ` AND city = $${values.length}`;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, values);
        return result.rows;
    },

    // READ - get a single opportunity by id
    async getOpportunityById(id) {
        // $1=id
        const result = await pool.query(
            `SELECT * FROM ${opportunityModel.table} WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // CREATE - add a new opportunity
    async createOpportunity(data) {
        const { title, type, description, field, city, latitude, longitude, deadline, link, created_by } = data;

        // $1=title, $2=type, $3=description, $4=field, $5=city,
        // $6=latitude, $7=longitude, $8=deadline, $9=link, $10=created_by
        const result = await pool.query(
            `INSERT INTO ${opportunityModel.table}
             (title, type, description, field, city, latitude, longitude, deadline, link, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [title, type, description, field, city, latitude, longitude, deadline, link, created_by]
        );

        return result.rows[0];
    },

    // UPDATE - edit an opportunity (only if owned by this user)
    async updateOpportunity(id, userId, data) {
        const { title, type, description, field, city, latitude, longitude, deadline, link } = data;

        // $1 to $9 = the fields being updated, $10=id, $11=userId (ownership check)
        const result = await pool.query(
            `UPDATE ${opportunityModel.table}
             SET title = $1, type = $2, description = $3, field = $4, city = $5,
                 latitude = $6, longitude = $7, deadline = $8, link = $9
             WHERE id = $10 AND created_by = $11
             RETURNING *`,
            [title, type, description, field, city, latitude, longitude, deadline, link, id, userId]
        );

        return result.rows[0]; // undefined if not found or not owned by this user
    },

    // DELETE - remove an opportunity (only if owned by this user)
    async deleteOpportunity(id, userId) {
        // $1=id, $2=userId (ownership check)
        const result = await pool.query(
            `DELETE FROM ${opportunityModel.table} WHERE id = $1 AND created_by = $2 RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    },

};

module.exports = opportunityService;