import { supabase } from '../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const user = await authMiddleware(req);
        const { id } = req.query;

        if (req.method === 'GET') {
            // Get trip by ID
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            if (!data) return res.status(404).json({ error: 'Trip not found' });

            return res.status(200).json(data);
        }

        if (req.method === 'PUT') {
            // Update trip
            const { title, description, start_date, end_date } = req.body;

            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (start_date !== undefined) updateData.start_date = start_date;
            if (end_date !== undefined) updateData.end_date = end_date;

            const { data, error } = await supabase
                .from('trips')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'DELETE') {
            // Delete trip
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return res.status(200).json({ message: 'Trip deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
