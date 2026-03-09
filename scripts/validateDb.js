import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function validateAndInitialize() {
    const client = await pool.connect();
    try {
        console.log('--- Starting DB Validation ---');

        // 1. Connection check
        const timeRes = await client.query('SELECT NOW()');
        console.log('✔ Connection verified:', timeRes.rows[0].now);

        // 2. Schema initialization
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        console.log('✔ Schema initialized/verified.');

        // 3. CRUD Validation
        const testUserId = 999999999;

        // Insert
        await client.query('INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [testUserId]);
        console.log('✔ Insert test user success.');

        // Read
        const readRes = await client.query('SELECT * FROM users WHERE id = $1', [testUserId]);
        if (readRes.rows.length > 0) {
            console.log('✔ Read test user success.');
        } else {
            throw new Error('Read test user failed: no rows found');
        }

        // Delete
        await client.query('DELETE FROM users WHERE id = $1', [testUserId]);
        console.log('✔ Delete test user success.');

        console.log('--- All DB Validations Passed ---');
    } catch (err) {
        console.error('✘ DB Validation Error:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

validateAndInitialize();
