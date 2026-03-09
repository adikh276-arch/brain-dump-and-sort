import { neon, neonConfig } from '@neondatabase/serverless';

// This allows the driver to work in the browser via HTTP/WebSockets
neonConfig.fetchConnectionCache = true;

const connectionString = import.meta.env.VITE_DATABASE_URL || "";

// 'neon' returns a function that can be used for standard SQL queries
export const sql = neon(connectionString);

/**
 * Executes a SQL query with parameters.
 */
export const query = async (text: string, params?: any[]) => {
    return await sql(text, params || []);
};
