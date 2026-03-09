import { pool } from './db';

/**
 * Ensures a user exists in the database.
 * The ID is the one returned from the Auth Handshake.
 */
export async function initializeUser(userId: string | number) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
            [id]
        );
    } catch (err) {
        console.error('Failed to initialize user:', err);
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Fetches all sessions for a specific user.
 */
export async function fetchUserSessions(userId: string | number) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const client = await pool.connect();
    try {
        // Fetch sessions and their associated thoughts in one go or separate
        const sessionRes = await client.query(
            'SELECT * FROM sessions WHERE user_id = $1 ORDER BY date DESC',
            [id]
        );

        const sessions = sessionRes.rows;

        for (const session of sessions) {
            const thoughtRes = await client.query(
                'SELECT local_id as id, text, bucket FROM thoughts WHERE session_id = $1 AND user_id = $2',
                [session.id, id]
            );
            session.thoughts = thoughtRes.rows;
        }

        return sessions;
    } catch (err) {
        console.error('Failed to fetch user sessions:', err);
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Saves a complete session with thoughts to the database.
 */
export async function saveSession(userId: string | number, session: any) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert session
        await client.query(
            'INSERT INTO sessions (id, user_id, date, reflection) VALUES ($1, $2, $3, $4)',
            [session.id, id, session.date, session.reflection]
        );

        // 2. Insert thoughts
        for (const thought of session.thoughts) {
            await client.query(
                'INSERT INTO thoughts (local_id, session_id, user_id, text, bucket) VALUES ($1, $2, $3, $4, $5)',
                [thought.id, session.id, id, thought.text, thought.bucket]
            );
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Failed to save session:', err);
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Deletes a session and its associated thoughts.
 */
export async function deleteSession(userId: string | number, sessionId: string) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const client = await pool.connect();
    try {
        await client.query(
            'DELETE FROM sessions WHERE id = $1 AND user_id = $2',
            [sessionId, id]
        );
    } catch (err) {
        console.error('Failed to delete session:', err);
        throw err;
    } finally {
        client.release();
    }
}
