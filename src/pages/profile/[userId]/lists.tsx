import { ReactElement } from "react";

import { indexer } from "@/common/api/indexer";
import { useRouteQuery } from "@/common/lib";
import { ListCard, getRandomBackgroundImage } from "@/entities/lists";
import { ProfileLayout } from "@/entities/profile";

export const NoResults = ({ text }: { text: string }) => (
  <div className="md:flex-col md:px-[105px] md:py-[68px] flex flex-col-reverse items-center justify-between rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px]">
    <p className="font-italic font-500 md:text-[22px] mb-4 max-w-[290px] text-center font-lora text-[16px] text-[#292929]">
      {text}
    </p>

    <img
      className="w-[50%]"
      src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
      alt="pots"
    />
  </div>
);

const ProfileLists = () => {
  const {
    query: { userId },
  } = useRouteQuery();
  const { data } = indexer.useLists({
    account: userId as string,
  });

  return (
    <div className="w-full">
      {data?.results?.length ? (
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
      ) : (
        <NoResults text="This Project has no List yet." />
      )}
    </div>
  );
};

ProfileLists.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileLists;
