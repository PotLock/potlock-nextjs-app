import Image from "next/image";
import Link from "next/link";

import { potlock } from "@/common/api/potlock";
import { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import routesPath from "@/modules/core/routes";

export type ProfileLinkProps = ByAccountId & { className?: string };

export const ProfileLink: React.FC<ProfileLinkProps> = ({
  accountId,
  className,
}) => {
  const { data: account } = potlock.useAccount({ accountId });

  const { name, image } = account?.near_social_profile_data ?? {};

  const imageUrl =
    image?.url ?? image?.nft?.media ?? image?.ipfs_cid
      ? `https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/${image.ipfs_cid}`
      : null;

  return (
    <Link
      href={`${routesPath.PROFILE}/${accountId}`}
      target="_blank"
      className={cn("decoration-none flex items-center gap-1", className)}
    >
      {imageUrl ? (
        <Image
          alt={`${name ?? accountId}'s profile picture`}
          src={imageUrl}
          width={20}
          height={20}
        />
      ) : (
        <span className="prose text-5">🌐</span>
      )}

      <span className="prose" un-decoration="hover:underline">
        {name ?? accountId}
      </span>
    </Link>
  );
};
