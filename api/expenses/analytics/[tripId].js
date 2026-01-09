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

        // Get expenses for the trip
        const { data: expenses, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('trip_id', tripId);

        if (error) throw error;

        // Calculate analytics
        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const count = expenses.length;

        // Category breakdown
        const categoryMap = {};
        expenses.forEach((expense) => {
            if (!categoryMap[expense.category]) {
                categoryMap[expense.category] = 0;
            }
            categoryMap[expense.category] += parseFloat(expense.amount);
        });

        const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
            category,
            amount,
        }));

        return res.status(200).json({
            total,
            count,
            categoryBreakdown,
        });
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
