import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✔ Neon database connection works!');
        console.log('Current time from DB:', res.rows[0].now);
        await pool.end();
    } catch (err) {
        console.error('✘ Database connection failed:', err);
        process.exit(1);
    }
}

testConnection();
