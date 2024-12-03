import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { walletApi } from "@/common/api/near";
import { Button } from "@/common/ui/components";
import { useAllLists } from "@/entities/lists/hooks/useAllLists";

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
    <div className="relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden bg-hero">
      <div className="md:px-10 md:py-16 relative z-[1] flex flex-col items-center  justify-center px-5 py-12">
        <div className=" flex flex-col items-center justify-center text-center tracking-normal">
          <h1 className=" md:w-[80%] md:text-[96px] m-0  font-lora text-[56px] font-medium leading-[100px]">
            LISTS
          </h1>
          <p className="m-0 p-0 text-[16px]">
            Lists allows anyone to create fundraising initiatives for groundbreaking public goods.{" "}
          </p>
        </div>
        {walletApi?.accountId && (
          <div className="max-md:flex-col md:mt-10 md:gap-8 mt-6 flex w-full items-center justify-center gap-4 text-sm">
            <Button className="md:w-[180px] w-full" onClick={handleCreateList}>
              Create List
            </Button>
            <Button className="md:w-[180px] w-full" variant={"brand-tonal"} onClick={fetchMyLists}>
              View My Lists
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListHero;
