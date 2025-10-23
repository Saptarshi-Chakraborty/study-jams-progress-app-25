"use client"

import React from 'react';
import { Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import BottomNavigation from '../shared/BottomNavigation';
import { IndividualReportProvider, useIndividualReport } from '../../contexts/IndividualReportContext';
import ParticipantList from './ParticipantList';
import ReportDetails from './ReportDetails';

const ReportSelector = () => {
    const {
        reports,
        selectedReportId,
        setSelectedReportId,
        loadingReports,
        error,
        refreshParticipants
    } = useIndividualReport();

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 pt-0">
            <label htmlFor="report-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Report Date
            </label>
            <div className="relative flex items-center gap-2">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        id="report-select"
                        value={selectedReportId || ''}
                        onChange={(e) => setSelectedReportId(parseInt(e.target.value, 10))}
                        disabled={loadingReports || reports.length === 0}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 appearance-none"
                    >
                        {loadingReports ? (
                            <option>Loading reports...</option>
                        ) : reports.length > 0 ? (
                            reports.map(report => (
                                <option key={report.id} value={report.id}>
                                    {new Date(report.report_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </option>
                            ))
                        ) : (
                            <option>No reports found</option>
                        )}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <button
                    onClick={() => refreshParticipants && refreshParticipants()}
                    disabled={loadingReports || !selectedReportId}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Refresh Report"
                >
                    <RefreshCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

const IndividualReportContent = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                <header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>
                    </div>
                    <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">Individual Reports</h2>
                </header>

                <ReportSelector />

                <div className="flex-1 flex overflow-hidden text-gray-800 dark:text-gray-200">
                    <ParticipantList />
                    <ReportDetails />
                </div>
                <BottomNavigation activeTab="reports" />
            </div>
        </div>
    );
};

const BodyIndividualReport = () => {
    return (
        <IndividualReportProvider>
            <IndividualReportContent />
        </IndividualReportProvider>
    );
}

export default BodyIndividualReport