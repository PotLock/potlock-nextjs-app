import { NEARSocialUserProfile } from "@/common/contracts/social";

const getProfileTeamMembersData = (profileData?: NEARSocialUserProfile) => {
  if (!profileData) return [];

  const team = profileData.plTeam
    ? JSON.parse(profileData.plTeam)
    : profileData.team
      ? Object.entries(profileData.team)
          .filter(([_, v]) => v !== null)
          .map(([k, _]) => k)
      : [];

  return team;
};

export default getProfileTeamMembersData;
