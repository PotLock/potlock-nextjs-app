export const getTeamMembersFromProfile = (profileData: any) => {
  if (!profileData) return [];

  const team = profileData.plTeam
    ? JSON.parse(profileData.plTeam)
    : profileData.team
      ? Object.entries(profileData.team)
          .filter(([, v]) => v !== null)
          .map(([k]) => k)
      : [];

  return team;
};
