// Component for progress bar
export const ProgressBar = ({ phase, processed, total }) => {
    const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
    let phaseText = '';

    switch (phase) {
        case 'creating':
            phaseText = 'Creating report entry...';
            break;
        case 'uploading':
            phaseText = `Uploading participants (${processed}/${total})`;
            break;
        case 'updating':
            phaseText = 'Updating report statistics...';
            break;
        default:
            return null;
    }

    return (
        <div className="mt-4 mb-6">
            <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{phaseText}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// Component for Failed Records Table
export const FailedRecordsTable = ({ records }) => {
    if (!records || records.length === 0) return null;

    // Choose a subset of headers to display (for better UX)
    const displayHeaders = ['User Name', 'User Email', 'errorMessage'];

    return (
        <div className="overflow-x-auto mt-4 mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        {displayHeaders.map((header) => (
                            <th
                                key={header}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {header === 'errorMessage' ? 'Error Message' : header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {records.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            {displayHeaders.map((header) => (
                                <td
                                    key={`${index}-${header}`}
                                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300"
                                >
                                    {record[header] || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
