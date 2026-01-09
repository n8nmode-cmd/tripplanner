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
        const { tripId } = req.query;

        const { data: items, error } = await supabase
            .from('checklist_items')
            .select('category, is_completed')
            .eq('trip_id', tripId);

        if (error) throw error;

        const stats = {
            total: items.length,
            completed: items.filter(i => i.is_completed).length,
            byCategory: {},
        };

        ['packing', 'documents', 'tasks', 'places'].forEach(category => {
            const categoryItems = items.filter(i => i.category === category);
            stats.byCategory[category] = {
                total: categoryItems.length,
                completed: categoryItems.filter(i => i.is_completed).length,
            };
        });

        return res.status(200).json(stats);
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
