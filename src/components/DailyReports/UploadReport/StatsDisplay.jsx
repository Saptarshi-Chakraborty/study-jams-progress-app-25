import { UploadCloud, File, X, Calendar, Loader2, ChevronDown, ChevronUp, Eye, RefreshCw, AlertTriangle, CheckCircle, Users, Award, Trophy, Layout } from 'lucide-react'
import { ProgressBar } from './OtherComponents';


// Stats Display Component
const StatsDisplay = ({ stats, date }) => {
    if (!stats) return null;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">
                Report Statistics for {new Date(date)?.toLocaleDateString()}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center mb-2">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                        <h4 className="font-medium text-blue-800 dark:text-blue-300">Total Participants</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.TOTAL_PARTICIPANTS}</p>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-2">
                        <Award className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                        <h4 className="font-medium text-green-800 dark:text-green-300">Skill Badges Completed</h4>
                    </div>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.TOTAL_SKILL_BADGES_COMPLETED}</p>
                </div>

                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center mb-2">
                        <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                        <h4 className="font-medium text-purple-800 dark:text-purple-300">Arcade Games Completed</h4>
                    </div>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.TOTAL_ARCADE_GAMES_COMPLETED}</p>
                </div>

                <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-2" />
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">All Labs Completed</h4>
                    </div>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.TOTAL_ALL_LABS_COMPLETED}</p>
                </div>

                <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800 md:col-span-2 xl:col-span-4">
                    <div className="flex items-center mb-2">
                        <Layout className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-2" />
                        <h4 className="font-medium text-teal-800 dark:text-teal-300">Access Codes Redeemed</h4>
                    </div>
                    <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">{stats.TOTAL_ACCESS_CODES_REDEEMED}</p>
                </div>
            </div>
        </div>
    );
};


// Warning Component
export const UploadWarning = ({ uploadProgress }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Upload in Progress
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>Please do not refresh or close this page until the upload is complete.</p>
                        <p className="mt-1">Doing so may result in corrupted or incomplete data.</p>
                    </div>
                </div>
            </div>
            
            {uploadProgress.phase && (
                <ProgressBar 
                    phase={uploadProgress.phase}
                    processed={uploadProgress.processed}
                    total={uploadProgress.total}
                />
            )}
        </div>
    );
};

export default StatsDisplay;