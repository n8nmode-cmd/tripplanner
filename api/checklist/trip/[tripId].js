import { supabase } from '../../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const user = await authMiddleware(req);
        const { tripId } = req.query;

        // Verify the trip belongs to the user
        const { data: trip } = await supabase
            .from('trips')
            .select('id')
            .eq('id', tripId)
            .eq('user_id', user.id)
            .single();

        if (!trip) {
            return res.status(403).json({ error: 'Unauthorized access to trip' });
        }

        const { data, error } = await supabase
            .from('checklist_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('position', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
