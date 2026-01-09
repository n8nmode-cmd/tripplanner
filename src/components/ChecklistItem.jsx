import React from 'react';
import { Check, Trash2, Circle } from 'lucide-react';
import { PRIORITY_COLORS } from '../utils/constants';

const ChecklistItem = ({ item, onToggle, onDelete }) => {
    const priorityColor = PRIORITY_COLORS[item.priority];

    return (
        <div
            className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${item.is_completed
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.is_completed
                        ? 'bg-primary border-primary'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                    }`}
            >
                {item.is_completed ? (
                    <Check className="w-4 h-4 text-white" />
                ) : (
                    <Circle className="w-3 h-3 text-transparent" />
                )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h4
                            className={`font-medium ${item.is_completed
                                    ? 'line-through text-gray-400 dark:text-gray-500'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                        >
                            {item.title}
                        </h4>
                        {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center gap-2">
                        <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                                backgroundColor: `${priorityColor}20`,
                                color: priorityColor,
                            }}
                        >
                            {item.priority}
                        </span>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChecklistItem;
