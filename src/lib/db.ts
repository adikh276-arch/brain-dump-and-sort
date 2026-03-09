import pkg from 'pg';
const { Pool } = pkg;

// Use the environment variable for the connection string
const connectionString = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

export const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
