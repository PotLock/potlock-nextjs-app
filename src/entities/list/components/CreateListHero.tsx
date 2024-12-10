export const CreateListHero = ({ onEditPage }: { onEditPage: boolean }) => {
  return onEditPage ? (
    <div className="mb-8 flex w-full items-center  justify-center border-b-[1px] border-[#DBDBDB] p-4">
      <h1 className="text-[20px] font-bold ">Edit List Settings</h1>
    </div>
  ) : (
    <div className="relative flex w-full flex-col justify-center overflow-hidden bg-hero">
      <div className="relative z-[1] flex flex-col justify-center px-5 py-12  text-center md:px-10 md:py-16">
        <h1 className="lett m-0 mb-2 font-lora text-[24px]  font-medium leading-none tracking-tight md:mb-6 md:text-[32px]">
          CREATE A
        </h1>
        <h1 className="font-lora text-[64px] leading-none tracking-[-5px] md:text-[72px]">
          NEW LIST
        </h1>
      </div>
    </div>
  );
};
