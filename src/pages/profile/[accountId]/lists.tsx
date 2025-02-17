import { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import type { AccountId } from "@/common/types";
import { Label, NoResultsPlaceholder, Switch } from "@/common/ui/components";
import { ListCard, getRandomBackgroundImage } from "@/entities/list";
import { ProfileLayout } from "@/layout/profile/components/layout";

const ProfileLists = () => {
  const router = useRouter();
  const { accountId } = router.query as { accountId: AccountId };
  const [administratedListsOnly, setAdministratedListsOnly] = useState(false);

  const { data } = indexer.useLists({
    account: accountId,
    ...(administratedListsOnly ? { admin: accountId } : {}),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Label htmlFor="admin">Show Lists Where User is an Admin</Label>
        <Switch
          id="admin"
          checked={administratedListsOnly}
          onClick={() => setAdministratedListsOnly(!administratedListsOnly)}
        />
      </div>
      <div className="w-full">
        {data?.results?.length ? (
          <div className="mt-8 grid w-full grid-cols-1 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-3">
            {data?.results?.map((item) => {
              let background = "";
              let backdrop = "";

              if (!item.cover_image_url) {
                ({ background, backdrop } = getRandomBackgroundImage());
              }

              return (
                <ListCard
                  background={background}
                  backdrop={backdrop}
                  dataForList={item}
                  key={item.id}
                />
              );
            })}
          </div>
        ) : (
          <NoResultsPlaceholder text="No lists owned by this project." />
        )}
      </div>
    </div>
  );
};

ProfileLists.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileLists;
