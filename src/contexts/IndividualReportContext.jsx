import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

const IndividualReportContext = createContext();

export const useIndividualReport = () => useContext(IndividualReportContext);

export const IndividualReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [loadingReports, setLoadingReports] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [loadingFilter, setLoadingFilter] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUnredeemedOnly, setShowUnredeemedOnly] = useState(false);
    const [showNoArcadeGames, setShowNoArcadeGames] = useState(false);
    const [minSkillBadges, setMinSkillBadges] = useState(0);
    const [showSkillBadgeFilter, setShowSkillBadgeFilter] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const workerRef = useRef(null);
    const debounceTimerRef = useRef(null);

    // Initialize Web Worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/participantFilter.worker.js', import.meta.url));
        
        workerRef.current.onmessage = (e) => {
            setFilteredParticipants(e.data.filteredParticipants);
            setLoadingFilter(false);
        };

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Filter participants using Web Worker with debouncing
    useEffect(() => {
        if (participants.length === 0) {
            setFilteredParticipants([]);
            return;
        }

        setLoadingFilter(true);
        
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Debounce for search term changes
        const delay = searchTerm ? 300 : 0;
        
        debounceTimerRef.current = setTimeout(() => {
            if (workerRef.current) {
                workerRef.current.postMessage({
                    participants,
                    searchTerm,
                    showUnredeemedOnly,
                    showNoArcadeGames,
                    minSkillBadges: showSkillBadgeFilter ? minSkillBadges : 0,
                    showSkillBadgeFilter
                });
            }
        }, delay);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [participants, searchTerm, showUnredeemedOnly, showNoArcadeGames, minSkillBadges, showSkillBadgeFilter]);

    useEffect(() => {
        const fetchReports = async () => {
            setLoadingReports(true);
            setError(null);
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Authentication token not found. Please log in again.');
                setLoadingReports(false);
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
                const sortedReports = result.data.sort((a, b) => new Date(b.report_date) - new Date(a.report_date));
                setReports(sortedReports);

                if (sortedReports.length > 0) {
                    setSelectedReportId(sortedReports[0].id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingReports(false);
            }
        };

        fetchReports();
    }, []);

    const fetchParticipants = useCallback(async (forceRefresh = false) => {
        if (!selectedReportId) return;

        setParticipants([]);
        setFilteredParticipants([]);
        setSelectedParticipant(null);
        setLoadingParticipants(true);
        setError(null);

        if (!forceRefresh) {
            const cachedItem = localStorage.getItem(`participants_${selectedReportId}`);
            if (cachedItem) {
                const { timestamp, data } = JSON.parse(cachedItem);
                const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
                if (new Date().getTime() - timestamp < sixHours) {
                    setParticipants(data);
                    setLoadingParticipants(false);
                    return;
                }
            }
        }

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token not found.');
            setLoadingParticipants(false);
            return;
        }

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/reports/get-one`;

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ report_id: selectedReportId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch participants.');
            }

            const result = await response.json();
            const participantsData = result.data || [];
            
            const transformedParticipants = participantsData.map(participant => ({
                ...participant,
                public_profile_url: participant.skill_boost_url,
                completed_skill_badges: participant.name_of_skill_badges_completed
                    ? participant.name_of_skill_badges_completed
                        .split('|')
                        .map(name => name.replace('[Skill Badge]', '').trim())
                        .filter(Boolean)
                    : [],
                completed_arcade_games: participant.name_of_arcade_games_completed
                    ? participant.name_of_arcade_games_completed
                        .split('|')
                        .map(name => name.replace('[Game]', '').trim())
                        .filter(Boolean)
                    : [],
            }));

            setParticipants(transformedParticipants);
            
            const cacheData = {
                timestamp: new Date().getTime(),
                data: transformedParticipants
            };
            localStorage.setItem(`participants_${selectedReportId}`, JSON.stringify(cacheData));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingParticipants(false);
        }
    }, [selectedReportId]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const refreshParticipants = useCallback(() => {
        fetchParticipants(true);
    }, [fetchParticipants]);

    const handleParticipantSelect = (participant) => {
        if (selectedParticipant?.id === participant.id) return;

        setSelectedParticipant(participant);
    };

    const value = {
        reports,
        selectedReportId,
        setSelectedReportId,
        participants,
        selectedParticipant,
        loadingReports,
        loadingParticipants,
        loadingFilter,
        error,
        searchTerm,
        setSearchTerm,
        handleParticipantSelect,
        filteredParticipants,
        refreshParticipants,
        showUnredeemedOnly,
        setShowUnredeemedOnly,
        showNoArcadeGames,
        setShowNoArcadeGames,
        minSkillBadges,
        setMinSkillBadges,
        showSkillBadgeFilter,
        setShowSkillBadgeFilter,
        showFilters,
        setShowFilters,
    };

    return (
        <IndividualReportContext.Provider value={value}>
            {children}
        </IndividualReportContext.Provider>
    );
};
