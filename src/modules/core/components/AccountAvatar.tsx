/* eslint-disable @next/next/no-img-element */

import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/modules/profile";

export const AccountAvatar = ({
  accountId,
  className,
}: {
  accountId?: string;
  className?: string;
}) => {
  const { avatarSrc } = useProfileData(accountId);

  return (
    <img
      alt="avatar"
      className={cn(`h-[12px] w-[12px] rounded-[50%] bg-white`, className)}
      src={avatarSrc}
    />
  );
};
