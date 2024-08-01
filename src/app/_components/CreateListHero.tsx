import Link from "next/link";

import { Button } from "@/common/ui/components";

export const CreateListtHero = () => {
  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-hero bg-cover bg-no-repeat">
      <div className="relative z-[1] flex flex-col justify-center px-5 py-12  text-center md:px-10 md:py-16">
        <h1 className="lett m-0 font-lora text-4xl font-medium leading-none tracking-tight md:text-[40px]">
          Create a New List
        </h1>
        <h3>
          Lists allows anyone to create fundraising <br /> initiatives for
          groundbreaking public goods. Learn more
        </h3>
      </div>
    </div>
  );
};

export default CreateListtHero;
