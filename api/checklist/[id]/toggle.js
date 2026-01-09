import { supabase } from '../../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        // Get current status
        const { data: item } = await supabase
            .from('checklist_items')
            .select('is_completed')
            .eq('id', id)
            .single();

        if (!item) {
            return res.status(404).json({ error: 'Checklist item not found' });
        }

        // Toggle the status
        const { data, error } = await supabase
            .from('checklist_items')
            .update({ is_completed: !item.is_completed })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
