/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import Link from "next/link";

import { NEARSocialUserProfile } from "@/common/contracts/social";
import routesPath from "@/modules/core/routes";

import { useProfileData } from "../hooks/data";
import getProfileTeamMembersData from "../utils/getProfileTeamMembersData";

const NoTeam = () => (
  <p className="m-0 flex w-full flex-col">No team members to display</p>
);

const TeamAvatar = ({ teamMemberId }: { teamMemberId: string }) => {
  const { profileImages } = useProfileData(teamMemberId);

  return (
    <div className="md:h-[180px] md:w-[180px] h-[160px] w-[160px]">
      <img
        sizes="(max-width: 768px) 100vw"
        className="grayscale-100 h-full w-full rounded-[6px] object-cover transition-all hover:grayscale-0"
        src={profileImages.image}
        alt={`Profile @${teamMemberId}`}
      />
    </div>
  );
};

const Members = ({ team }: { team?: string[] }) => {
  if (!team || team.length === 0) return "";

  const members = team.map((teamMember) => {
    const match = teamMember.match(/.near/i);
    if (match && match.length > 0) {
      return (
        <Link
          key={teamMember}
          className="hover:decoration-none flex cursor-pointer flex-col justify-start gap-2"
          href={`${routesPath.PROFILE}/${teamMember}`}
          target="_blank"
        >
          <TeamAvatar teamMemberId={teamMember} />
          <p className="font-400 text-base text-[#2e2e2e]">@{teamMember}</p>
        </Link>
      );
    }
  });

  return members;
};

type Props = {
  profile?: NEARSocialUserProfile;
};

const Team = ({ profile }: Props) => {
  const [team, setTeam] = useState(getProfileTeamMembersData(profile));

  useEffect(() => {
    if (profile) {
      setTeam(getProfileTeamMembersData(profile));
    }
  }, [profile]);

  return (
    <div className="md:flex-row mt-8 flex flex-col items-start justify-start">
      {/* col 1 */}
      <div className="md:w-[272px] mb-4 flex w-full">
        <h2 className="font-600 text-base text-[#2e2e2e]">Team members</h2>
      </div>
      {/* col 2 */}
      <div className="md:ml-16 flex w-full">
        {/* Team Members Container */}
        <div className="flex flex-wrap items-center justify-start gap-8">
          {team.length > 0 ? <Members team={team} /> : <NoTeam />}
        </div>
      </div>
    </div>
  );
};

export default Team;
