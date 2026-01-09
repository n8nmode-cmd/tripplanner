import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { checklistService } from '../services/api';
import { CHECKLIST_CATEGORIES } from '../utils/constants';
import ChecklistItem from './ChecklistItem';
import AddChecklistModal from './AddChecklistModal';
import ChecklistTemplates from './ChecklistTemplates';

const ChecklistSection = ({ tripId }) => {
    const [items, setItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('packing');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChecklist();
        loadStats();
    }, [tripId]);

    const loadChecklist = async () => {
        try {
            const data = await checklistService.getByTrip(tripId);
            setItems(data);
        } catch (error) {
            console.error('Failed to load checklist:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await checklistService.getStats(tripId);
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleToggle = async (id) => {
        try {
            await checklistService.toggle(id);
            loadChecklist();
            loadStats();
        } catch (error) {
            console.error('Failed to toggle item:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await checklistService.delete(id);
            loadChecklist();
            loadStats();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleItemAdded = () => {
        loadChecklist();
        loadStats();
        setShowAddModal(false);
    };

    const handleTemplateApplied = () => {
        loadChecklist();
        loadStats();
        setShowTemplates(false);
    };

    const categoryItems = items.filter(item => item.category === activeCategory);
    const categoryInfo = CHECKLIST_CATEGORIES.find(c => c.value === activeCategory);

    const getProgress = (category) => {
        if (!stats?.byCategory[category]) return 0;
        const { total, completed } = stats.byCategory[category];
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    if (loading) {
        return <div className="text-center py-8">Loading checklist...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with Overall Progress */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Trip Checklist
                    </h2>
                    {stats && stats.total > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {stats.completed} of {stats.total} completed
                                </span>
                                <span className="font-semibold text-primary">
                                    {Math.round((stats.completed / stats.total) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowTemplates(true)}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    Use Template
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {CHECKLIST_CATEGORIES.map((category) => {
                    const progress = getProgress(category.value);
                    const isActive = activeCategory === category.value;
                    return (
                        <button
                            key={category.value}
                            onClick={() => setActiveCategory(category.value)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all whitespace-nowrap ${isActive
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                        >
                            <span className="text-2xl">{category.icon}</span>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {category.label}
                                </div>
                                {stats?.byCategory[category.value]?.total > 0 && (
                                    <div className="text-xs text-gray-500">
                                        {progress}% done
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Items List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">{categoryInfo?.icon}</span>
                        {categoryInfo?.label}
                    </h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </button>
                </div>

                {categoryItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No items in {categoryInfo?.label.toLowerCase()} yet
                        </p>
                        <button onClick={() => setShowAddModal(true)} className="btn-primary">
                            Add First Item
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {categoryItems.map((item) => (
                            <ChecklistItem
                                key={item.id}
                                item={item}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddChecklistModal
                    tripId={tripId}
                    defaultCategory={activeCategory}
                    onClose={() => setShowAddModal(false)}
                    onItemAdded={handleItemAdded}
                />
            )}

            {showTemplates && (
                <ChecklistTemplates
                    tripId={tripId}
                    onClose={() => setShowTemplates(false)}
                    onApplied={handleTemplateApplied}
                />
            )}
        </div>
    );
};

export default ChecklistSection;
