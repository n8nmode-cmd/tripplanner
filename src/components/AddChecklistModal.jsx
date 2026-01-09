import React, { useState } from 'react';
import { X } from 'lucide-react';
import { checklistService } from '../services/api';
import { CHECKLIST_CATEGORIES } from '../utils/constants';

const AddChecklistModal = ({ tripId, defaultCategory, onClose, onItemAdded }) => {
    const [formData, setFormData] = useState({
        trip_id: tripId,
        category: defaultCategory || 'packing',
        title: '',
        description: '',
        priority: 'medium',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Please enter a title');
            return;
        }

        setLoading(true);
        try {
            await checklistService.create(formData);
            onItemAdded();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Checklist Item</h2>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CHECKLIST_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                    className={`p-3 rounded-lg border-2 transition-all ${formData.category === cat.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{cat.icon}</div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Pack sunscreen"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input resize-none"
                            rows="2"
                            placeholder="SPF 50+ for beach protection"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priority
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['low', 'medium', 'high'].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority })}
                                    className={`py-2 px-4 rounded-lg border-2 capitalize transition-all ${formData.priority === priority
                                            ? 'border-primary bg-primary/10 font-semibold'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddChecklistModal;
