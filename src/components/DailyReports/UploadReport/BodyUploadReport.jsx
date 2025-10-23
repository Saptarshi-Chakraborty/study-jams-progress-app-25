import { AlertTriangle, Calendar, ChevronDown, ChevronUp, Eye, File, Loader2, RefreshCw, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import BottomNavigation from '../../shared/BottomNavigation';
import CsvPreviewTable from './CsvPreviewTable';
import StatsDisplay, { UploadWarning } from './StatsDisplay';
import { FailedRecordsTable } from './OtherComponents';



const BodyUploadReport = () => {
    const { readString } = usePapaParse();
    const [reportDate, setReportDate] = useState('')
    const [file, setFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef(null)

    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({
        phase: '', // 'creating', 'uploading', 'updating'
        processed: 0,
        total: 0
    });

    // Add state for tracking failed records
    const [failedRecords, setFailedRecords] = useState([]);
    const [showFailedRecords, setShowFailedRecords] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    // Add state to track the original report ID for retries
    const [originalReportId, setOriginalReportId] = useState(null);
    // Add state to track combined stats
    const [combinedStats, setCombinedStats] = useState(null);
    // Add state to track if upload is complete
    const [isUploadComplete, setIsUploadComplete] = useState(false);

    const resetCsvState = () => {
        setCsvData([]);
        setCsvHeaders([]);
        setShowPreview(false);
    }

    const parseCsv = (fileToParse) => {
        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            readString(target.result, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvHeaders(results.meta.fields);
                    setCsvData(results.data);
                },
            });
        };
        reader.readAsText(fileToParse);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        resetCsvState();
        if (selectedFile) {
            if (selectedFile.type === 'text/csv') {
                setFile(selectedFile)
                setError('')
                parseCsv(selectedFile);
            } else {
                setFile(null)
                setError('Please select a .csv file.')
                e.target.value = null // Reset file input
            }
        }
    }

    const handleFileDrop = (e) => {
        e.preventDefault()
        resetCsvState();
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            if (droppedFile.type === 'text/csv') {
                setFile(droppedFile)
                setError('')
                parseCsv(droppedFile);
            } else {
                setError('Please select a .csv file.')
            }
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleRemoveFile = () => {
        setFile(null)
        resetCsvState();
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Step 1: Create the initial report entry
    const createReportEntry = async (authToken) => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/reports/create-new`;

        try {
            setUploadProgress({ phase: 'creating', processed: 0, total: 1 });

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ date: reportDate }),
            };

            const response = await fetch(API, params);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create report entry.');
            }

            const result = await response.json();
            const reportId = result.data?.id;

            if (!reportId) {
                throw new Error('Could not find report ID in the server response.');
            }

            console.log(`Report entry created with ID: ${reportId}`);
            setUploadProgress({ phase: 'creating', processed: 1, total: 1 });

            return reportId;
        } catch (error) {
            console.error('Error creating report entry:', error);
            throw error;
        }
    };

    // Step 2: Upload participant data from CSV
    const uploadParticipantData = async (reportId, authToken, dataToUpload = null) => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/participants/upload-report`;

        let successfulUploads = 0;
        let failedUploads = 0;
        let newFailedRecords = [];

        const dataSource = dataToUpload || csvData;

        const stats = {
            TOTAL_PARTICIPANTS: dataSource.length,
            TOTAL_SKILL_BADGES_COMPLETED: 0,
            TOTAL_ARCADE_GAMES_COMPLETED: 0,
            TOTAL_ALL_LABS_COMPLETED: 0,
            TOTAL_ACCESS_CODES_REDEEMED: 0
        };

        setUploadProgress({
            phase: 'uploading',
            processed: 0,
            total: dataSource.length
        });

        try {
            for (let i = 0; i < dataSource.length; i++) {
                const row = dataSource[i];

                const participantData = {
                    report_id: reportId,
                    name: row['User Name']?.trim() || '',
                    email: row['User Email']?.trim().toLowerCase() || '',
                    public_profile_url: row['Google Cloud Skills Boost Profile URL'] || '',
                    public_profile_okay: row['Profile URL Status'] === 'All Good',
                    access_code_redeemed: row['Access Code Redemption Status'] === 'Yes',
                    all_labs_completed: row['All Skill Badges & Games Completed'] === 'Yes',
                    no_of_skills_badges_completed: parseInt(row['# of Skill Badges Completed'] || 0, 10),
                    name_of_skills_badges_completed: row['Names of Completed Skill Badges'] || '',
                    no_of_arcade_games_completed: parseInt(row['# of Arcade Games Completed'] || 0, 10),
                    name_of_arcade_games_completed: row['Names of Completed Arcade Games'] || '',
                };

                // Update statistics
                if (participantData.access_code_redeemed)
                    stats.TOTAL_ACCESS_CODES_REDEEMED++;
                if (participantData.all_labs_completed)
                    stats.TOTAL_ALL_LABS_COMPLETED++;
                if (participantData.no_of_skills_badges_completed >= 15)
                    stats.TOTAL_SKILL_BADGES_COMPLETED++;
                if (participantData.no_of_arcade_games_completed >= 1)
                    stats.TOTAL_ARCADE_GAMES_COMPLETED++;

                try {
                    const params = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                        body: JSON.stringify(participantData),
                    };

                    const participantResponse = await fetch(API, params);
                    const participantResult = await participantResponse.json();

                    if (participantResult.status === 'success') {
                        successfulUploads++;
                    } else {
                        console.error(`Failed to upload data for ${participantData.email}:`,
                            participantResult.message || await participantResponse.text());
                        failedUploads++;
                        // Store failed record with error message
                        newFailedRecords.push({
                            ...row,
                            errorMessage: participantResult.message || 'Unknown error'
                        });
                    }
                } catch (uploadError) {
                    console.error(`An error occurred while uploading data for ${participantData.email}:`, uploadError);
                    failedUploads++;
                    // Store failed record with error message
                    newFailedRecords.push({
                        ...row,
                        errorMessage: uploadError.message || 'Network or server error'
                    });
                }

                setUploadProgress({
                    phase: 'uploading',
                    processed: i + 1,
                    total: dataSource.length
                });
            }

            console.log(`Upload process completed. Successful: ${successfulUploads}, Failed: ${failedUploads}.`);

            // Set failed records state
            if (!dataToUpload) {
                setFailedRecords(newFailedRecords);
            } else {
                // For retries, remove successfully uploaded records from failedRecords
                const updatedFailedRecords = failedRecords.filter(record =>
                    newFailedRecords.some(newRecord =>
                        newRecord['User Email'] === record['User Email']
                    )
                );
                setFailedRecords(updatedFailedRecords);
            }

            return { stats, successfulUploads, failedUploads, newFailedRecords };

        } catch (error) {
            console.error('Error uploading participant data:', error);
            throw error;
        }
    };

    // Step 3: Update report statistics
    const updateReportStats = async (reportId, stats, authToken) => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/reports/update-stats`;

        try {
            setUploadProgress({ phase: 'updating', processed: 0, total: 1 });

            const statsData = {
                id: reportId,
                total_participants: stats.TOTAL_PARTICIPANTS,
                total_skill_badges_completed: stats.TOTAL_SKILL_BADGES_COMPLETED,
                total_arcade_games_completed: stats.TOTAL_ARCADE_GAMES_COMPLETED,
                total_all_labs_completed: stats.TOTAL_ALL_LABS_COMPLETED,
                total_access_codes_redeemed: stats.TOTAL_ACCESS_CODES_REDEEMED,
            };

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(statsData),
            };

            const statsResponse = await fetch(API, params);
            const statsResult = await statsResponse.json();

            setUploadProgress({ phase: 'updating', processed: 1, total: 1 });

            if (statsResult.status === 'success') {
                console.log('Report stats updated successfully.');
                return true;
            } else {
                console.error('Failed to update report stats:',
                    statsResult.message || await statsResponse.text());
                return false;
            }
        } catch (error) {
            console.error('Error updating report stats:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportDate || !file) {
            setError('Please fill in all fields.');
            return;
        }

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token not found. Please log in again.');
            return;
        }

        setIsUploading(true);
        setError('');
        setFailedRecords([]);
        setOriginalReportId(null); // Reset original report ID
        setCombinedStats(null); // Reset combined stats
        setIsUploadComplete(false); // Reset upload complete state

        try {
            // Step 1: Create report entry
            const reportId = await createReportEntry(authToken);

            // Store the report ID for potential retries
            setOriginalReportId(reportId);

            // Step 2: Upload participant data
            const { stats, successfulUploads, failedUploads } =
                await uploadParticipantData(reportId, authToken);

            // Store the combined stats for potential retries
            setCombinedStats(stats);

            // Step 3: Update report statistics
            await updateReportStats(reportId, stats, authToken);

            // Set upload as complete to display stats
            setIsUploadComplete(true);

            if (failedUploads > 0) {
                setShowFailedRecords(true);
                alert(`Upload completed with some issues. Successful: ${successfulUploads}, Failed: ${failedUploads}. Check the failed records section below.`);
            } else {
                alert(`Upload completed successfully. All ${successfulUploads} records were uploaded.`);
                // Only reset form when no failures (moved from previous location)
                if (failedUploads === 0) {
                    setReportDate('');
                    handleRemoveFile();
                }
            }

            setUploadProgress({ phase: '', processed: 0, total: 0 });

        } catch (err) {
            setError(err.message || 'An error occurred during the upload process.');
            console.error('Upload process error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    // Function to retry uploading failed records
    const handleRetryFailedRecords = async () => {
        if (failedRecords.length === 0 || !originalReportId || !combinedStats) return;

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token not found. Please log in again.');
            return;
        }

        setIsRetrying(true);

        try {
            // Use the original report ID instead of creating a new one
            const { stats: retryStats, successfulUploads, failedUploads } =
                await uploadParticipantData(originalReportId, authToken, failedRecords);

            // Combine original stats with retry stats
            const updatedStats = {
                TOTAL_PARTICIPANTS: combinedStats.TOTAL_PARTICIPANTS, // Total participants remains the same
                TOTAL_SKILL_BADGES_COMPLETED:
                    combinedStats.TOTAL_SKILL_BADGES_COMPLETED + retryStats.TOTAL_SKILL_BADGES_COMPLETED,
                TOTAL_ARCADE_GAMES_COMPLETED:
                    combinedStats.TOTAL_ARCADE_GAMES_COMPLETED + retryStats.TOTAL_ARCADE_GAMES_COMPLETED,
                TOTAL_ALL_LABS_COMPLETED:
                    combinedStats.TOTAL_ALL_LABS_COMPLETED + retryStats.TOTAL_ALL_LABS_COMPLETED,
                TOTAL_ACCESS_CODES_REDEEMED:
                    combinedStats.TOTAL_ACCESS_CODES_REDEEMED + retryStats.TOTAL_ACCESS_CODES_REDEEMED,
            };

            // Update the combined stats for any future retries
            setCombinedStats(updatedStats);

            // Update the report with the combined stats
            await updateReportStats(originalReportId, updatedStats, authToken);

            if (failedUploads === 0) {
                setShowFailedRecords(false);
                alert(`All ${successfulUploads} records were successfully uploaded on retry.`);
                // Reset the form only if all retries were successful
                setReportDate('');
                handleRemoveFile();
                setIsUploadComplete(false); // Hide the stats display after a successful retry
            } else {
                alert(`Retry completed. Successful: ${successfulUploads}, Still Failed: ${failedUploads}`);
            }
        } catch (err) {
            setError(err.message || 'An error occurred during the retry process.');
            console.error('Retry process error:', err);
        } finally {
            setIsRetrying(false);
        }
    };




    // Function to reset the form and start a new upload
    const handleStartNewUpload = () => {
        setReportDate('');
        handleRemoveFile();
        setIsUploadComplete(false);
        setFailedRecords([]);
        setOriginalReportId(null);
        setCombinedStats(null);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
            <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full h-full flex flex-col">
                {/* Header */}
                <header className="p-4 bg-gray-50 dark:bg-gray-900 shrink-0">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>
                    </div>
                    <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">Upload Daily Report</h2>
                </header>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    <main className="p-4 md:p-6 lg:p-8 xl:p-10">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
                            {/* Show warning during upload */}
                            {(isUploading || isRetrying) && (
                                <UploadWarning uploadProgress={uploadProgress} />
                            )}

                            {/* Show stats after successful upload */}
                            {isUploadComplete && combinedStats && !isUploading && !isRetrying && (
                                <>
                                    <StatsDisplay stats={combinedStats} date={reportDate} />

                                    {failedRecords.length === 0 && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={handleStartNewUpload}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Upload Another Report
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Show failed records section if there are any */}
                            {failedRecords.length > 0 && !isUploading && !isRetrying && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mt-6">
                                    <div className="flex items-center mb-4">
                                        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                            {failedRecords.length} records failed to upload
                                        </h3>
                                    </div>

                                    <button type="button" onClick={() => setShowFailedRecords(!showFailedRecords)} className="flex items-center text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mb-2">
                                        {showFailedRecords ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                                        {showFailedRecords ? 'Hide' : 'Show'} failed records
                                    </button>

                                    {showFailedRecords && <FailedRecordsTable records={failedRecords} />}

                                    <button
                                        type="button"
                                        onClick={handleRetryFailedRecords}
                                        disabled={isRetrying || isUploading}
                                        className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        {isRetrying && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <RefreshCw className="h-4 w-4" />
                                        <span>{isRetrying ? 'Retrying...' : 'Retry Failed Records'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Show the form when not uploading and not showing complete stats */}
                            {!isUploading && !isRetrying && (!isUploadComplete || failedRecords.length > 0) && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Date</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input type="date" id="reportDate" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report File (.csv)</label>
                                        <div onDrop={handleFileDrop} onDragOver={handleDragOver} onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                            <div className="space-y-1 text-center">
                                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <p className="pl-1">Drag and drop, or click to upload</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">CSV files only</p>
                                                <input id="file-upload" name="file-upload" type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="sr-only" />
                                            </div>
                                        </div>
                                        {file && (<div className="mt-3 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md"><div className="flex items-center gap-2"><File className="h-5 w-5 text-gray-500" /><span className="text-sm font-medium text-gray-800 dark:text-gray-200">{file.name}</span></div><button type="button" onClick={handleRemoveFile} className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"><X className="h-5 w-5" /></button></div>)}
                                    </div>

                                    {/* Progress Bar during upload */}
                                    {(isUploading || isRetrying) && uploadProgress.phase && (
                                        <ProgressBar
                                            phase={uploadProgress.phase}
                                            processed={uploadProgress.processed}
                                            total={uploadProgress.total}
                                        />
                                    )}

                                    {file && csvData.length > 0 && (
                                        <div>
                                            <button type="button" onClick={() => setShowPreview(!showPreview)} className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <Eye className="h-4 w-4" />
                                                <span>{showPreview ? 'Hide' : 'Show'} Preview ({csvData.length} rows)</span>
                                                {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>

                                            {showPreview && <CsvPreviewTable headers={csvHeaders} data={csvData} />}
                                        </div>
                                    )}

                                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isUploading || isRetrying || !file || !reportDate}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                                                <span>{isUploading ? 'Uploading...' : 'Upload Report'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </main>
                </div>

                {/* Footer Navigation */}
                <BottomNavigation activeTab="profile" />
            </div>
        </div>
    )
}

export default BodyUploadReport