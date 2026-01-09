import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService, expenseService } from '../services/api';
import { ArrowLeft, Plus, Trash2, Edit2, PieChart } from 'lucide-react';
import { formatDate, formatCurrency, getCategoryInfo } from '../utils/constants';
import AddExpenseModal from '../components/AddExpenseModal';
import CategoryChart from '../components/CategoryChart';
import ChecklistSection from '../components/ChecklistSection';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);

    useEffect(() => {
        loadTripData();
    }, [id]);

    const loadTripData = async () => {
        try {
            const [tripData, expensesData, analyticsData] = await Promise.all([
                tripService.getById(id),
                expenseService.getByTrip(id),
                expenseService.getAnalytics(id),
            ]);
            setTrip(tripData);
            setExpenses(expensesData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to load trip data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            await expenseService.delete(expenseId);
            loadTripData();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const handleDeleteTrip = async () => {
        if (!confirm('Are you sure you want to delete this trip? All expenses will be deleted as well.')) return;

        try {
            await tripService.delete(id);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete trip:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Trip not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{trip.title}</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleDeleteTrip} className="text-red-600 hover:text-red-700 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Expenses</h3>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(analytics?.total || 0)}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Number of Expenses</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.count || 0}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average per Expense</h3>
                        <p className="text-3xl font-bold text-accent">{formatCurrency(analytics?.total && analytics?.count ? analytics.total / analytics.count : 0)}</p>
                    </div>
                </div>

                {/* Chart and Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Expense Breakdown
                            </h2>
                            {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                                <CategoryChart data={analytics.categoryBreakdown} />
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No expenses yet</p>
                            )}
                        </div>
                    </div>

                    {/* Expenses List */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expenses</h2>
                            <button onClick={() => setShowAddExpense(true)} className="btn-primary inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Expense
                            </button>
                        </div>

                        {expenses.length === 0 ? (
                            <div className="card text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">No expenses yet</p>
                                <button onClick={() => setShowAddExpense(true)} className="btn-primary">
                                    Add Your First Expense
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {expenses.map((expense) => {
                                    const category = getCategoryInfo(expense.category);
                                    return (
                                        <div key={expense.id} className="card">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-3xl">{category.icon}</div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {category.label}
                                                            {expense.subcategory && ` - ${expense.subcategory}`}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{expense.description}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(expense.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Checklist Section */}
                <div className="mt-12">
                    <ChecklistSection tripId={id} />
                </div>
            </main>

            {/* Add Expense Modal */}
            {showAddExpense && (
                <AddExpenseModal
                    tripId={id}
                    onClose={() => setShowAddExpense(false)}
                    onExpenseAdded={() => {
                        loadTripData();
                        setShowAddExpense(false);
                    }}
                />
            )}
        </div>
    );
};

export default TripDetail;
