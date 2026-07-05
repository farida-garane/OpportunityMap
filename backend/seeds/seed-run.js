require('dotenv').config();
const pool = require('../config/db');
const opportunities = require('./seed-data');

async function seedDatabase() {
    console.log(`Inserting ${opportunities.length} opportunities...`);

    for (const opp of opportunities) {
        // $1=title, $2=type, $3=description, $4=field, $5=city,
        // $6=latitude, $7=longitude, $8=deadline, $9=link
        await pool.query(
            `INSERT INTO opportunities
             (title, type, description, field, city, latitude, longitude, deadline, link)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                opp.title,
                opp.type,
                opp.description,
                opp.field,
                opp.city,
                opp.latitude,
                opp.longitude,
                opp.deadline,
                opp.link,
            ]
        );
    }

    console.log("Database seeded successfully!");
    process.exit();
}

seedDatabase().catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
});