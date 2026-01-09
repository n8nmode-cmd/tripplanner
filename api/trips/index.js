import { supabase } from '../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const user = await authMiddleware(req);

        if (req.method === 'GET') {
            // Get all trips for user
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            // Create new trip
            const { title, description, start_date, end_date } = req.body;

            const { data, error } = await supabase
                .from('trips')
                .insert([
                    {
                        user_id: user.id,
                        title,
                        description,
                        start_date,
                        end_date,
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
