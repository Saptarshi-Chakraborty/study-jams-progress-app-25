import React from 'react';
import { User, ExternalLink, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { useIndividualReport } from '../../contexts/IndividualReportContext';
import { SKILL_BADGES as skillBadges, ARCADE_GAMES as arcadeGames} from '../../data/SYLLABUS';

const ReportDetails = () => {
    const { selectedParticipant, mobileView, setMobileView } = useIndividualReport();

    return (
        <div className={`w-full lg:w-3/4 p-4 lg:p-6 overflow-y-auto ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
            {selectedParticipant ? (
                <div className="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-lg shadow-lg">
                    {/* Mobile back button */}
                    <button
                        onClick={() => setMobileView('list')}
                        className="lg:hidden flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-4 -ml-2 p-2 active:bg-blue-50 dark:active:bg-blue-900/20 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="font-medium">Back to list</span>
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex-grow min-w-0 w-full sm:w-auto">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words">{selectedParticipant.name}</h2>
                            <p className="text-sm lg:text-md text-gray-500 dark:text-gray-400 break-all mt-1">{selectedParticipant.email}</p>
                        </div>
                        {selectedParticipant.public_profile_url && (
                            <a
                                href={selectedParticipant.public_profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto whitespace-nowrap transition-colors"
                            >
                                Public Profile <ExternalLink className="ml-2 -mr-1 h-5 w-5" />
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 lg:mb-8">
                        <div className="p-5 lg:p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                            <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Skill Badges Completed</p>
                            <p className="text-3xl lg:text-4xl font-bold text-blue-500 mt-2">{selectedParticipant.no_of_skill_badges_completed}</p>
                        </div>
                        <div className="p-5 lg:p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                            <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Arcade Games Completed</p>
                            <p className="text-3xl lg:text-4xl font-bold text-purple-500 mt-2">{selectedParticipant.no_of_arcade_games_completed}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                            <h3 className="text-lg lg:text-xl font-semibold mb-4 text-blue-500 sticky top-0 bg-white dark:bg-gray-800 py-2 -mt-2 z-10">Skill Badges Status</h3>
                            <ul className="space-y-2 lg:space-y-3">
                                {skillBadges.map(badge => (
                                    <li key={badge.id} className="flex items-center justify-between p-3 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                        <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 flex-grow pr-2 break-words">{badge.name}</span>
                                        {selectedParticipant.completed_skill_badges?.includes(badge.name) ? (
                                            <CheckCircle2 className="h-5 w-5 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" title="Completed" />
                                        ) : (
                                            <XCircle className="h-5 w-5 lg:h-5 lg:w-5 text-red-500 flex-shrink-0" title="Not Completed" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg lg:text-xl font-semibold mb-4 text-purple-500 sticky top-0 bg-white dark:bg-gray-800 py-2 -mt-2 z-10">Arcade Games Status</h3>
                            <ul className="space-y-2 lg:space-y-3">
                                {arcadeGames.map(game => (
                                    <li key={game.id} className="flex items-center justify-between p-3 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                        <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 flex-grow pr-2 break-words">{game.name}</span>
                                        {selectedParticipant.completed_arcade_games?.includes(game.name) ? (
                                            <CheckCircle2 className="h-5 w-5 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" title="Completed" />
                                        ) : (
                                            <XCircle className="h-5 w-5 lg:h-5 lg:w-5 text-red-500 flex-shrink-0" title="Not Completed" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
                    <User className="h-16 w-16 lg:h-20 lg:w-20 text-gray-400 mb-4" />
                    <h3 className="text-xl lg:text-2xl font-semibold">Select a Participant</h3>
                    <p className="mt-2 text-sm lg:text-base px-4">Choose a participant from the list to view their progress report.</p>
                    <button
                        onClick={() => setMobileView('list')}
                        className="lg:hidden mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 font-medium transition-colors shadow-md"
                    >
                        View Participant List
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportDetails;
