import { supabase } from '../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { trip_id, category, subcategory, amount, description, date } = req.body;

        // Verify the trip exists (optional, but good for data integrity)
        // No user_id check needed anymore
        const { data: trip } = await supabase
            .from('trips')
            .select('id')
            .eq('id', trip_id)
            .single();

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const { data, error } = await supabase
            .from('expenses')
            .insert([
                {
                    trip_id,
                    category,
                    subcategory,
                    amount,
                    description,
                    date,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
