import React from 'react';
import { User, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { useIndividualReport } from '../../contexts/IndividualReportContext';
// import { skillBadges, arcadeGames } from '../../data/studyJamsData';
import { SKILL_BADGES as skillBadges, ARCADE_GAMES as arcadeGames} from '../../data/SYLLABUS';

const ReportDetails = () => {
    const { selectedParticipant } = useIndividualReport();

    return (
        <div className="w-2/3 lg:w-3/4 p-6 overflow-y-auto">
            {selectedParticipant ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedParticipant.name}</h2>
                            <p className="text-md text-gray-500 dark:text-gray-400">{selectedParticipant.email}</p>
                        </div>
                        {selectedParticipant.public_profile_url && (
                            <a
                                href={selectedParticipant.public_profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Public Profile <ExternalLink className="ml-2 -mr-1 h-5 w-5" />
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Skill Badges Completed</p>
                            <p className="text-4xl font-bold text-blue-500 mt-2">{selectedParticipant.no_of_skill_badges_completed}</p>
                        </div>
                        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Arcade Games Completed</p>
                            <p className="text-4xl font-bold text-purple-500 mt-2">{selectedParticipant.no_of_arcade_games_completed}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-blue-500">Skill Badges Status</h3>
                            <ul className="space-y-3">
                                {skillBadges.map(badge => (
                                    <li key={badge.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">{badge.name}</span>
                                        {selectedParticipant.completed_skill_badges?.includes(badge.name) ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" title="Completed" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" title="Not Completed" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-purple-500">Arcade Games Status</h3>
                            <ul className="space-y-3">
                                {arcadeGames.map(game => (
                                    <li key={game.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">{game.name}</span>
                                        {selectedParticipant.completed_arcade_games?.includes(game.name) ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" title="Completed" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" title="Not Completed" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <User className="h-20 w-20 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-semibold">Select a Participant</h3>
                    <p className="mt-2">Choose a participant from the list on the left to view their progress report.</p>
                </div>
            )}
        </div>
    );
};

export default ReportDetails;
