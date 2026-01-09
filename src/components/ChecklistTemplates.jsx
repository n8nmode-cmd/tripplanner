import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { checklistService } from '../services/api';
import { CHECKLIST_TEMPLATES } from '../utils/constants';

const ChecklistTemplates = ({ tripId, onClose, onApplied }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApplyTemplate = async () => {
        if (!selectedTemplate) {
            setError('Please select a template');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await checklistService.applyTemplate(tripId, selectedTemplate);
            onApplied();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to apply template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checklist Templates</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Choose a template to automatically populate your checklist with essential items for your trip type.
                </p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {CHECKLIST_TEMPLATES.map((template) => (
                        <button
                            key={template.value}
                            onClick={() => setSelectedTemplate(template.value)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${selectedTemplate === template.value
                                    ? 'border-primary bg-primary/10 shadow-lg'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-4xl">{template.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {template.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {template.description}
                                    </p>
                                </div>
                                {selectedTemplate === template.value && (
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Pro Tip</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        Templates will add items to your existing checklist. You can customize, add more items, or delete
                        any you don't need after applying the template.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 btn-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={handleApplyTemplate}
                        disabled={!selectedTemplate || loading}
                        className="flex-1 btn-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            'Applying...'
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Apply Template
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChecklistTemplates;
