import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/api';
import { Plus, LogOut, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../utils/constants';
import AddTripModal from '../components/AddTripModal';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            const data = await tripService.getAll();
            setTrips(data);
        } catch (error) {
            console.error('Failed to load trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleTripAdded = () => {
        loadTrips();
        setShowAddModal(false);
    };

    const getTripStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
        if (now >= start && now <= end) return { text: 'Ongoing', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
        return { text: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Trips</h1>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {trips.length === 0 ? (
                    <div className="text-center py-16">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No trips yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start tracking your expenses by creating your first trip</p>
                        <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Your First Trip
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600 dark:text-gray-400">{trips.length} {trips.length === 1 ? 'trip' : 'trips'} total</p>
                            <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Trip
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => {
                                const status = getTripStatus(trip.start_date, trip.end_date);
                                return (
                                    <div
                                        key={trip.id}
                                        onClick={() => navigate(`/trip/${trip.id}`)}
                                        className="card cursor-pointer hover:scale-105 transition-transform duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{trip.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.text}
                                            </span>
                                        </div>

                                        {trip.description && (
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{trip.description}</p>
                                        )}

                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            {/* Add Trip Modal */}
            {showAddModal && (
                <AddTripModal
                    onClose={() => setShowAddModal(false)}
                    onTripAdded={handleTripAdded}
                />
            )}
        </div>
    );
};

export default Dashboard;
