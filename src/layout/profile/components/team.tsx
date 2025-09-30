import { useMemo } from "react";

import Link from "next/link";

import { NEARSocialUserProfile } from "@/common/contracts/social-db";
import type { AccountId, ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { routeSelectors } from "@/navigation";

const extractProfileTeamMembers = (profileData: NEARSocialUserProfile) => {
  if (profileData.plTeam !== undefined) {
    return JSON.parse(profileData.plTeam);
  } else if (profileData.team !== undefined) {
    return Object.entries(profileData.team)
      .filter(([_, v]) => v !== null)
      .map(([k, _]) => k);
  } else return undefined;
};

const TeamMemberAvatar = ({ accountId }: ByAccountId) => {
  const { avatar } = useAccountSocialProfile({ accountId });

  return (
    <div className="h-[160px] w-[160px] md:h-[180px] md:w-[180px]">
      <img
        alt={`@${accountId}'s profile`}
        sizes="(max-width: 768px) 100vw"
        src={avatar.url}
        className={cn(
          "grayscale-100 h-full w-full rounded-[6px]",
          "object-cover transition-all hover:grayscale-0",
        )}
      />
    </div>
  );
};

export type ProfileLayoutTeamProps = {
  profile?: NEARSocialUserProfile;
};

export const ProfileLayoutTeam: React.FC<ProfileLayoutTeamProps> = ({ profile }) => {
  const teamMemberAccountIds = useMemo(
    () => (profile === undefined ? [] : (extractProfileTeamMembers(profile) ?? [])),
    [profile],
  );

  return (
    <div className="mt-8 flex flex-col items-start justify-start md:flex-row">
      <div className="mb-4 flex w-full md:w-[272px]">
        <h2 className="font-600 text-base text-[#2e2e2e]">Team members</h2>
      </div>

      <div className="flex w-full">
        <div className="flex flex-wrap items-center justify-start gap-8">
          {teamMemberAccountIds.length > 0 ? (
            teamMemberAccountIds.map((accountId: AccountId) => (
              <Link
                key={accountId}
                target="_blank"
                href={routeSelectors.PROFILE_BY_ID(accountId)}
                className="hover:decoration-none flex cursor-pointer flex-col justify-start gap-2"
              >
                <TeamMemberAvatar accountId={accountId} />
                <p className="font-400 text-base text-[#2e2e2e]">@{accountId}</p>
              </Link>
            ))
          ) : (
            <p className="m-0 flex w-full flex-col">{"No team members to display"}</p>
          )}
        </div>
      </div>
    </div>
  );
};
