import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/common/ui/components";
import { useAllLists } from "@/modules/lists/hooks/useAllLists";
import useWallet from "@/modules/auth/hooks/useWallet";

export const ListHero = ({
  setCurrentListType,
  setFilteredRegistrations,
}: {
  setCurrentListType: (type: string) => void;
  setFilteredRegistrations: (type: any) => void;
}) => {
  const { push } = useRouter();
  const { wallet } = useWallet();
  const { fetchMyLists } = useAllLists(
    wallet,
    setCurrentListType,
    setFilteredRegistrations,
  );

  const handleCreateList = useCallback(() => {
    push("/list/create");
  }, []);

  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-hero bg-cover bg-no-repeat">
      <div className="md:px-10 md:py-16 relative z-[1] flex flex-col  justify-center px-5 py-12">
        <h1 className="lett md:w-[80%]  md:text-[40px] m-0 text-4xl font-medium leading-[48px] tracking-tight">
          Lists allows anyone to create fundraising initiatives for
          groundbreaking public goods.
        </h1>
        <div className="max-md:flex-col md:mt-10 md:gap-8 mt-6 flex items-center gap-4 text-sm">
          <Button className="md:w-[180px] w-full" onClick={handleCreateList}>
            Create List
          </Button>

          <Button
            className="md:w-[180px] w-full"
            variant={"brand-tonal"}
            // asChild
            onClick={fetchMyLists}
          >
            View My Lists
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListHero;
