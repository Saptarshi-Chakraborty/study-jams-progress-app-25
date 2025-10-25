import React from 'react';
import { Search, Loader2, Ticket, Award, Gamepad2, CheckCircle2, Filter } from 'lucide-react';
import { useIndividualReport } from '../../contexts/IndividualReportContext';

const ParticipantList = () => {
    const {
        loadingParticipants,
        filteredParticipants,
        selectedParticipant,
        handleParticipantSelect,
        searchTerm,
        setSearchTerm,
        participants,
        refreshParticipants,
        showUnredeemedOnly,
        setShowUnredeemedOnly
    } = useIndividualReport();

    return (
        <div className="w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-3 py-1 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search participants..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loadingParticipants || participants.length === 0}
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <button
                        onClick={() => setShowUnredeemedOnly(!showUnredeemedOnly)}
                        disabled={loadingParticipants || participants.length === 0}
                        className={`px-3 py-1 text-xs rounded border transition-colors duration-200 ${
                            showUnredeemedOnly
                                ? 'bg-red-500 border-red-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={showUnredeemedOnly ? "Show all participants" : "Show unredeemed only"}
                    >
                        Not Redeemed
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {loadingParticipants ? (
                    <div className="flex items-center justify-center h-full p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : filteredParticipants.length > 0 ? filteredParticipants.map(participant => (
                    <div
                        key={participant.id}
                        className={`px-4 pb-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${selectedParticipant?.id === participant.id ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}
                        onClick={() => handleParticipantSelect(participant)}
                    >
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{participant.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{participant.email}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center" title={participant.access_code_redeemed ? "Access Code Redeemed" : "Access Code Not Redeemed"}>
                                <Ticket className={`h-4 w-4 ${participant.access_code_redeemed ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                            <div className="flex items-center" title="Skill Badges Completed">
                                <Award className="h-4 w-4 mr-1 text-blue-500" />
                                <span>{participant.no_of_skill_badges_completed}</span>
                            </div>
                            <div className="flex items-center" title="Arcade Games Completed">
                                <Gamepad2 className="h-4 w-4 mr-1 text-purple-500" />
                                <span>{participant.no_of_arcade_games_completed}</span>
                            </div>
                            {participant.all_labs_completed && (
                                <div className="flex items-center" title="All Labs Completed">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <p className="p-4 text-center text-gray-500">No participants found for this report.</p>
                )}
            </div>
        </div>
    );
};

export default ParticipantList;
