import { ReactElement } from "react";

import { indexer } from "@/common/api/indexer";
import { useRouteQuery } from "@/common/lib";
import { ListCard, getRandomBackgroundImage } from "@/modules/lists";
import { ProfileLayout } from "@/modules/profile";

const ProfileLists = () => {
  const {
    query: { userId },
  } = useRouteQuery();
  const { data } = indexer.useLists({
    account: userId as string,
  });
  return (
    <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8 pb-10">
      {data?.results?.map((item: any) => {
        let background = "";
        let backdrop = "";
        if (!item.cover_image) {
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
  );
};

ProfileLists.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileLists;
