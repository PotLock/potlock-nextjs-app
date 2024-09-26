export const CreateListHero = ({ onEditPage }: { onEditPage: boolean }) => {
  return onEditPage ? (
    <div className="mb-8 flex w-full items-center  justify-center border-b-[1px] border-[#DBDBDB] p-4">
      <h1 className="text-[20px] font-bold ">Edit List Settings</h1>
    </div>
  ) : (
    <div className="relative flex w-full flex-col justify-center overflow-hidden bg-hero">
      <div className="md:px-10 md:py-16 relative z-[1] flex flex-col justify-center  px-5 py-12 text-center">
        <h1 className="lett md:text-[32px] md:mb-6 m-0 mb-2  font-lora text-[24px] font-medium leading-none tracking-tight">
          CREATE A
        </h1>
        <h1 className="md:text-[72px] font-lora text-[64px] leading-none tracking-[-5px]">
          NEW LIST
        </h1>
      </div>
    </div>
  );
};
