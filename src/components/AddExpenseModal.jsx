import React, { useState } from 'react';
import { X } from 'lucide-react';
import { expenseService } from '../services/api';
import { EXPENSE_CATEGORIES, FOOD_SUBCATEGORIES } from '../utils/constants';

const AddExpenseModal = ({ tripId, onClose, onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        trip_id: tripId,
        category: '',
        subcategory: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.category) {
            setError('Please select a category');
            return;
        }

        if (formData.category === 'food' && !formData.subcategory) {
            setError('Please select a food subcategory');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (formData.category !== 'food') {
                delete dataToSubmit.subcategory;
            }

            await expenseService.create(dataToSubmit);
            onExpenseAdded();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Expense</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Category *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {EXPENSE_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value, subcategory: '' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.category === cat.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{cat.icon}</div>
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">{cat.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.category === 'food' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Food Type *
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {FOOD_SUBCATEGORIES.map((sub) => (
                                    <button
                                        key={sub.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, subcategory: sub.value })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.subcategory === sub.value
                                                ? 'border-food bg-food/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-food/50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{sub.icon}</div>
                                        <div className="text-xs font-medium text-gray-900 dark:text-white">{sub.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount (₹) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="input"
                            placeholder="1000.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input resize-none"
                            rows="3"
                            placeholder="Optional notes about this expense..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
