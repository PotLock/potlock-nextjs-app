import { useIsHuman } from "@/common/_deprecated/useIsHuman";
import { useRegistration } from "@/common/_deprecated/useRegistration";
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { listRegistrationStatusIcons } from "@/entities/list";
import { FollowStats } from "@/entities/profile";

export type ProfileLayoutHeroProps = {
  accountId: string; // near address (donor | project)
  isProject: boolean;
  imageStyle?: any;
  backgroundStyle?: any;
  containerStyle?: any;
};

export const ProfileLayoutHero: React.FC<ProfileLayoutHeroProps> = ({ isProject, accountId }) => {
  const { avatarSrc, backgroundSrc } = useAccountSocialProfile({ accountId });

  // get nadabot status on the donor page
  let isHumanVerified = false;
  const isHuman = useIsHuman(accountId);

  if (!isHuman.loading && !isProject) {
    isHumanVerified = isHuman.isHumanVerified;
  }

  // get registration if it is on project page
  const { registration } = useRegistration(accountId);

  return (
    <section un-position="relative">
      {/* profile Background  */}
      <div className="relative h-[318px] w-full">
        {backgroundSrc ? (
          <img
            className="h-full w-full rounded-xl object-cover"
            alt="background-image"
            src={backgroundSrc}
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      {/* profile image */}
      <div className="relative z-[6] flex -translate-y-2/4 items-end pl-2 md:pl-16">
        <div
          className={cn(
            "p-1.25 bg-background relative h-[120px] w-[120px] rounded-full",
            "max-[400px]:h-[90px] max-[400px]:w-[90px]",
          )}
        >
          {avatarSrc ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={avatarSrc} alt="profile-image" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>

        {/* Status */}
        <div
          className={cn(
            "relative z-[1] flex -translate-y-5 translate-x-[-25px] items-center gap-2 md:gap-6",
          )}
        >
          {registration.id ? (
            <div
              className={cn(
                "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {listRegistrationStatusIcons[registration.status].icon}

              <div
                className="hidden md:block"
                style={{ color: listRegistrationStatusIcons[registration.status].color }}
              >
                {registration.status}
              </div>
            </div>
          ) : isHumanVerified ? (
            <div
              className={cn(
                "bg-background flex items-center gap-1 overflow-hidden rounded-[20px]",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {listRegistrationStatusIcons.Approved.icon}

              <div style={{ color: listRegistrationStatusIcons.Approved.color }}>Verified</div>
            </div>
          ) : (
            <div style={{ width: "10px" }} />
          )}

          <FollowStats accountId={accountId} />
        </div>
      </div>
    </section>
  );
};
