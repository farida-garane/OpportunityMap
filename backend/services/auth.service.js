const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const userModel = require('../models/User');

const authService = {

    // CREATE - register a new user
    async registerUser({ name, email, password, field, city, study_level }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // $1=name, $2=email, $3=hashedPassword, $4=field, $5=city, $6=study_level
        const result = await pool.query(
            `INSERT INTO ${userModel.table} (name, email, password, field, city, study_level)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email, field, city, study_level, created_at`,
            [name, email, hashedPassword, field, city, study_level]
        );

        return result.rows[0];
    },

    // READ + VERIFY - login (check credentials, issue token)
    async loginUser({ email, password }) {
        // $1=email
        const result = await pool.query(
            `SELECT * FROM ${userModel.table} WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) return null;

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        delete user.password; // never send the hashed password back
        return { token, user };
    },

    // READ - get a single user's profile
    async getUserProfile(userId) {
        // $1=userId
        const result = await pool.query(
            `SELECT id, name, email, field, city, study_level, created_at FROM ${userModel.table} WHERE id = $1`,
            [userId]
        );
        return result.rows[0];
    },

};

module.exports = authService;