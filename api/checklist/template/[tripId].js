import { supabase } from '../../_config/supabase.js';
import { authMiddleware, handleError, handleCors } from '../../_middleware/auth.js';

// Checklist templates
const TEMPLATES = {
    beach: [
        { category: 'packing', title: 'Swimwear', priority: 'high' },
        { category: 'packing', title: 'Sunscreen SPF 50+', priority: 'high' },
        { category: 'packing', title: 'Beach towel', priority: 'medium' },
        { category: 'packing', title: 'Sunglasses', priority: 'medium' },
        { category: 'packing', title: 'Flip-flops/sandals', priority: 'medium' },
        { category: 'documents', title: 'Hotel booking confirmation', priority: 'high' },
        { category: 'tasks', title: 'Check weather forecast', priority: 'low' },
        { category: 'places', title: 'Beach activities booking', priority: 'medium' },
    ],
    business: [
        { category: 'packing', title: 'Laptop and charger', priority: 'high' },
        { category: 'packing', title: 'Business cards', priority: 'high' },
        { category: 'packing', title: 'Formal attire', priority: 'high' },
        { category: 'documents', title: 'Meeting schedules', priority: 'high' },
        { category: 'tasks', title: 'Prepare presentation', priority: 'high' },
    ],
    adventure: [
        { category: 'packing', title: 'Hiking boots', priority: 'high' },
        { category: 'packing', title: 'Backpack', priority: 'high' },
        { category: 'packing', title: 'First aid kit', priority: 'high' },
        { category: 'packing', title: 'Water bottle', priority: 'high' },
        { category: 'tasks', title: 'Check trail conditions', priority: 'high' },
    ],
    city: [
        { category: 'packing', title: 'Comfortable walking shoes', priority: 'high' },
        { category: 'packing', title: 'Camera', priority: 'medium' },
        { category: 'places', title: 'Famous landmarks', priority: 'high' },
        { category: 'places', title: 'Local restaurants', priority: 'medium' },
    ],
    international: [
        { category: 'documents', title: 'Passport', priority: 'high' },
        { category: 'documents', title: 'Visa (if required)', priority: 'high' },
        { category: 'documents', title: 'Travel insurance', priority: 'high' },
        { category: 'packing', title: 'Power adapter', priority: 'high' },
        { category: 'tasks', title: 'Notify bank of travel', priority: 'high' },
    ],
};

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
        const { tripId } = req.query;
        const { templateType } = req.body;

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

        const template = TEMPLATES[templateType];
        if (!template) {
            return res.status(400).json({ error: 'Invalid template type' });
        }

        // Create checklist items from template
        const items = template.map((item) => ({
            trip_id: tripId,
            category: item.category,
            title: item.title,
            description: item.description,
            priority: item.priority,
        }));

        const { data, error } = await supabase
            .from('checklist_items')
            .insert(items)
            .select();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
