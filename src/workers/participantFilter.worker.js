self.onmessage = function(e) {
    const { participants, searchTerm, showUnredeemedOnly, showNoArcadeGames, minSkillBadges, showSkillBadgeFilter } = e.data;
    
    const filteredParticipants = participants.filter(participant => {
        const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUnredeemedFilter = !showUnredeemedOnly || !participant.access_code_redeemed;
        const matchesArcadeFilter = !showNoArcadeGames || participant.no_of_arcade_games_completed === 0;
        const matchesSkillBadgeFilter = !showSkillBadgeFilter || participant.no_of_skill_badges_completed < minSkillBadges;
        return matchesSearch && matchesUnredeemedFilter && matchesArcadeFilter && matchesSkillBadgeFilter;
    });
    
    self.postMessage({ filteredParticipants });
};
