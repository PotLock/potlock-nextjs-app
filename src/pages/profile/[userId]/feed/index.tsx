import { ReactElement } from "react";

import { useRouter } from "next/router";

import { useRouteQuery } from "@/common/lib";
import { ProfileFeeds } from "@/entities/profile/components/ProfileFeeds";
import { ProfileLayout } from "@/layout/profile/components/ProfileLayout";

const ProfileFeedsTab = () => {
  const {
    query: { userId: userIdPathParam },
  } = useRouteQuery();

  const userId =
    (typeof userIdPathParam === "string" ? userIdPathParam : userIdPathParam?.at(0)) ?? "noop";

  return <ProfileFeeds accountId={userId} />;
};

ProfileFeedsTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileFeedsTab;
