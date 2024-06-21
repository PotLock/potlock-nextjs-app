import Image from "next/image";
import Link from "next/link";

import { ByAccountId, potlock } from "@/common/api/potlock";
import { cn } from "@/common/ui/utils";

export type ProfileLinkProps = ByAccountId & { className?: string };

export const ProfileLink: React.FC<ProfileLinkProps> = ({
  accountId,
  className,
}) => {
  const { data: accountData } = potlock.useAccount({ accountId });

  const accountSocialData = accountData?.near_social_profile_data;

  return (
    <Link
      href={`/user/${accountId}`}
      target="_blank"
      className={cn("flex items-center gap-1", className)}
    >
      {accountSocialData?.image?.url ? (
        <Image
          alt={`${accountSocialData.name}'s profile picture`}
          src={accountSocialData.image?.url}
          width={20}
          height={20}
        />
      ) : (
        <span className="prose text-5">🌐</span>
      )}

      <span className="prose">{accountSocialData?.name ?? accountId}</span>
    </Link>
  );
};
