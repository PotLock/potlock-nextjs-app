import { ReactElement } from "react";

import { useRouter } from "next/router";

import { ProfileLayout } from "@/modules/profile";
import ProfileFeeds from "@/modules/profile/components/ProfileFeeds";

const ProfileFeedsTab = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;
  const userId =
    (typeof userIdPathParam === "string"
      ? userIdPathParam
      : userIdPathParam?.at(0)) ?? "unknown";

  return <ProfileFeeds accountId={userId} />;
};
ProfileFeedsTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileFeedsTab;
