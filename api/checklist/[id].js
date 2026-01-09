import { supabase } from '../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../_middleware/auth.js';

export default async function handler(req, res) {
    handleCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { id } = req.query;

        if (req.method === 'PUT') {
            // Update checklist item
            const { title, description, priority, is_completed, position } = req.body;

            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (priority !== undefined) updateData.priority = priority;
            if (is_completed !== undefined) updateData.is_completed = is_completed;
            if (position !== undefined) updateData.position = position;

            const { data, error } = await supabase
                .from('checklist_items')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'DELETE') {
            // Delete checklist item
            const { error } = await supabase
                .from('checklist_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return res.status(200).json({ message: 'Checklist item deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
