import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { walletApi } from "@/common/api/near/client";
import { Button } from "@/common/ui/components";
import { useAllLists } from "@/entities/list/hooks/useAllLists";

export const ListHero = ({
  setCurrentListType,
  setFilteredRegistrations,
}: {
  setCurrentListType: (type: string) => void;
  setFilteredRegistrations: (type: any) => void;
}) => {
  const { push } = useRouter();
  const { fetchMyLists } = useAllLists(setCurrentListType, setFilteredRegistrations);

  const handleCreateList = useCallback(() => {
    push("/list/create");
  }, []);

  return (
    <div className="bg-hero relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden">
      <div className="relative z-[1] flex flex-col items-center justify-center px-5  py-12 md:px-10 md:py-16">
        <div className=" flex flex-col items-center justify-center text-center tracking-normal">
          <h1 className=" font-lora m-0 text-[56px]  font-medium leading-[100px] md:w-[80%] md:text-[96px]">
            LISTS
          </h1>
          <p className="m-0 p-0 text-[16px]">
            Lists allows anyone to create fundraising initiatives for groundbreaking public goods.{" "}
          </p>
        </div>
        {walletApi?.accountId && (
          <div className="mt-6 flex w-full items-center justify-center gap-4 text-sm max-md:flex-col md:mt-10 md:gap-8">
            <Button className="w-full md:w-[180px]" onClick={handleCreateList}>
              Create List
            </Button>
            <Button className="w-full md:w-[180px]" variant={"brand-tonal"} onClick={fetchMyLists}>
              View My Lists
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListHero;
