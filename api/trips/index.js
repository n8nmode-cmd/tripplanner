import { supabase } from '../_config/supabase.js';
import { handleError, handleCors } from '../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get all trips (no user filtering)
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            // Create new trip (no user ID needed)
            const { title, description, start_date, end_date } = req.body;

            const { data, error } = await supabase
                .from('trips')
                .insert([
                    {
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
        return handleError(res, error, 500);
    }
}
