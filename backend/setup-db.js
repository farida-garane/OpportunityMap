require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');
const opportunities = require('./seeds/seed-data');

async function setupDatabase() {
    try {
        console.log("Lecture du fichier SQL...");
        const sqlPath = path.join(__dirname, 'database', 'create_database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log("Création des tables dans la base de données...");
        await pool.query(sql);
        console.log("Tables créées avec succès !");

        console.log(`Insertion de ${opportunities.length} opportunités de démonstration...`);
        for (const opp of opportunities) {
            await pool.query(
                `INSERT INTO opportunities
                 (title, type, description, field, city, latitude, longitude, deadline, link)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    opp.title, opp.type, opp.description, opp.field, opp.city, 
                    opp.latitude, opp.longitude, opp.deadline, opp.link
                ]
            );
        }
        console.log("Base de données initialisée et remplie avec succès !");
        process.exit(0);
    } catch (err) {
        console.error("Erreur lors de l'initialisation de la base de données :", err);
        process.exit(1);
    }
}

setupDatabase();
