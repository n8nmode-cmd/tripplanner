export const EXPENSE_CATEGORIES = [
    { value: 'fuel', label: 'Fuel', color: '#EF4444', icon: '⛽' },
    { value: 'hotel', label: 'Hotel', color: '#8B5CF6', icon: '🏨' },
    { value: 'food', label: 'Food', color: '#EC4899', icon: '🍽️' },
    { value: 'parking', label: 'Parking', color: '#10B981', icon: '🅿️' },
    { value: 'toll', label: 'Toll', color: '#3B82F6', icon: '🛣️' },
    { value: 'other', label: 'Other', color: '#6B7280', icon: '💰' },
];

export const FOOD_SUBCATEGORIES = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '🌞' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'tea', label: 'Tea', icon: '☕' },
    { value: 'snacks', label: 'Snacks', icon: '🍿' },
];

export const CHECKLIST_CATEGORIES = [
    { value: 'packing', label: 'Packing', color: '#F59E0B', icon: '🎒' },
    { value: 'documents', label: 'Documents', color: '#3B82F6', icon: '📄' },
    { value: 'tasks', label: 'Tasks', color: '#10B981', icon: '✅' },
    { value: 'places', label: 'Places', color: '#EC4899', icon: '📍' },
];

export const CHECKLIST_TEMPLATES = [
    { value: 'beach', label: 'Beach Vacation', icon: '🏖️', description: 'Sunscreen, swimwear, beach essentials' },
    { value: 'business', label: 'Business Trip', icon: '💼', description: 'Laptop, formal attire, presentation materials' },
    { value: 'adventure', label: 'Adventure Trip', icon: '🏔️', description: 'Hiking gear, camping equipment' },
    { value: 'city', label: 'City Tour', icon: '🏙️', description: 'Camera, walking shoes, city guide' },
    { value: 'international', label: 'International', icon: '✈️', description: 'Passport, visa, travel insurance' },
];

export const PRIORITY_COLORS = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
};

export const getCategoryInfo = (category) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category) || EXPENSE_CATEGORIES[5];
};

export const getSubcategoryInfo = (subcategory) => {
    return FOOD_SUBCATEGORIES.find(sub => sub.value === subcategory);
};

export const getChecklistCategoryInfo = (category) => {
    return CHECKLIST_CATEGORIES.find(cat => cat.value === category) || CHECKLIST_CATEGORIES[0];
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
