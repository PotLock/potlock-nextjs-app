/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import Link from "next/link";

import { NEARSocialUserProfile } from "@/common/contracts/social";
import type { AccountId } from "@/common/types";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

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

const NoTeam = () => <p className="m-0 flex w-full flex-col">No team members to display</p>;

const TeamAvatar = ({ teamMemberId }: { teamMemberId: AccountId }) => {
  const { avatarSrc } = useAccountSocialProfile({ accountId: teamMemberId });

  return (
    <div className="h-[160px] w-[160px] md:h-[180px] md:w-[180px]">
      <img
        sizes="(max-width: 768px) 100vw"
        className="grayscale-100 h-full w-full rounded-[6px] object-cover transition-all hover:grayscale-0"
        src={avatarSrc}
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
          href={`${rootPathnames.PROFILE}/${teamMember}`}
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

export const Team = ({ profile }: Props) => {
  const [team, setTeam] = useState(getProfileTeamMembersData(profile));

  useEffect(() => {
    if (profile) {
      setTeam(getProfileTeamMembersData(profile));
    }
  }, [profile]);

  return (
    <div className="mt-8 flex flex-col items-start justify-start md:flex-row">
      {/* col 1 */}
      <div className="mb-4 flex w-full md:w-[272px]">
        <h2 className="font-600 text-base text-[#2e2e2e]">Team members</h2>
      </div>
      {/* col 2 */}
      <div className="flex w-full md:ml-16">
        {/* Team Members Container */}
        <div className="flex flex-wrap items-center justify-start gap-8">
          {team.length > 0 ? <Members team={team} /> : <NoTeam />}
        </div>
      </div>
    </div>
  );
};
