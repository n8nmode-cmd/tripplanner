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
        const user = await authMiddleware(req);
        const { trip_id, category, subcategory, amount, description, date } = req.body;

        // Verify the trip belongs to the user
        const { data: trip } = await supabase
            .from('trips')
            .select('id')
            .eq('id', trip_id)
            .eq('user_id', user.id)
            .single();

        if (!trip) {
            return res.status(403).json({ error: 'Unauthorized access to trip' });
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
