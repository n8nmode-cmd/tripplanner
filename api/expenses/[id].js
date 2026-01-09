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
            // Update expense
            const { category, subcategory, amount, description, date } = req.body;

            const updateData = {};
            if (category !== undefined) updateData.category = category;
            if (subcategory !== undefined) updateData.subcategory = subcategory;
            if (amount !== undefined) updateData.amount = amount;
            if (description !== undefined) updateData.description = description;
            if (date !== undefined) updateData.date = date;

            const { data, error } = await supabase
                .from('expenses')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'DELETE') {
            // Delete expense
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return res.status(200).json({ message: 'Expense deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return handleError(res, error, error.message.includes('authorization') ? 401 : 500);
    }
}
