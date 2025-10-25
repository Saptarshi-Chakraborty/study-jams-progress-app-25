import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router';
import { Loader2, AlertTriangle, Upload, RefreshCw, Trash2 } from 'lucide-react';
import BottomNavigation from '../shared/BottomNavigation';

const BodyViewAllReports = () => {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token not found. Please log in again.');
            setLoading(false);
            return;
        }

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/reports/view-all`;

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch reports.');
            }

            const result = await response.json();
            // Sort reports by date in descending order
            const sortedReports = result.data.sort((a, b) => new Date(b.report_date) - new Date(a.report_date));
            setReports(sortedReports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper function to calculate the difference from the previous report
    const calculateDifference = (currentValue, index, field) => {
        if (index === reports.length - 1) {
            // This is the oldest report, don't show anything
            return null;
        }
        
        const previousReport = reports[index + 1];
        const difference = currentValue - previousReport[field];
        
        if (difference > 0) {
            return { value: difference, type: 'increase' };
        } else if (difference < 0) {
            return { value: Math.abs(difference), type: 'decrease' };
        } else {
            return { value: 0, type: 'neutral' };
        }
    };

    // Helper function to render difference badge
    const renderDifference = (diff) => {
        if (!diff) return null;
        
        const colorClasses = {
            increase: 'text-green-600 dark:text-green-400',
            decrease: 'text-red-600 dark:text-red-400',
            neutral: 'text-gray-500 dark:text-gray-400'
        };
        
        const sign = diff.type === 'increase' ? '+' : diff.type === 'decrease' ? '-' : '+';
        
        return (
            <span className={`ml-2 text-xs font-medium ${colorClasses[diff.type]}`}>
                ({sign}{diff.value})
            </span>
        );
    };

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleDeleteClick = (reportId) => {
        setReportToDelete(reportId);
        setShowConfirmDialog(true);
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setReportToDelete(null);
    };

    const confirmDelete = async () => {
        if (!reportToDelete) return;
        setIsDeleting(true);
        setError(null);

        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/reports/delete`;

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ report_id: reportToDelete }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete report.');
            }

            setReports(reports.filter(report => report.id !== reportToDelete));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            setShowConfirmDialog(false);
            setReportToDelete(null);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                An error occurred
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (reports.length === 0) {
            return (
                <div className="text-center py-16">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No reports found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload a report to see it here.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Report Date</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Participants</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Skill Badges</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Arcade Games</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">All Labs Done</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Codes Redeemed</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uploaded At</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {reports.map((report, index) => (
                            <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(report.report_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                    {report.total_participants}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white text-center">
                                    {report.total_skill_badges_completed}
                                    {renderDifference(calculateDifference(report.total_skill_badges_completed, index, 'total_skill_badges_completed'))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white text-center">
                                    {report.total_arcade_game_completed}
                                    {renderDifference(calculateDifference(report.total_arcade_game_completed, index, 'total_arcade_game_completed'))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white text-center">
                                    {report.total_all_labs_completed}
                                    {renderDifference(calculateDifference(report.total_all_labs_completed, index, 'total_all_labs_completed'))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white text-center">
                                    {report.total_code_redeemed}
                                    {renderDifference(calculateDifference(report.total_code_redeemed, index, 'total_code_redeemed'))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(report.uploaded_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDeleteClick(report.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        <span className="sr-only">Delete report</span>
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
            <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full h-full flex flex-col">
                {/* Header */}
                <header className="p-4 bg-gray-50 dark:bg-gray-900 shrink-0">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>
                    </div>
                    <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">All Daily Reports</h2>
                </header>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    <main className="p-4 md:p-6 lg:p-8 xl:p-10">
                        <div className="flex justify-end gap-4 mb-4">
                            <button
                                onClick={() => router.push('/daily_reports/upload')}
                                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <Upload className="h-5 w-5 mr-2" />
                                Upload Report
                            </button>
                            <button
                                onClick={fetchReports}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-5 w-5 mr-2" />
                                )}
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        {renderContent()}
                    </main>
                </div>

                {/* Footer Navigation */}
                <BottomNavigation activeTab="reports" />
            </div>

            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100" id="modal-title">Confirm Deletion</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete this report? This will also delete all individual participant records associated with it. This action cannot be undone.
                        </p>
                        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={cancelDelete}
                                className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BodyViewAllReports