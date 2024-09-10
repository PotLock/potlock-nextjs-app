import Link from "next/link";

import { Button } from "@/common/ui/components";

export const CreateListtHero = ({ onEditPage }: { onEditPage: boolean }) => {
  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-hero bg-cover bg-no-repeat">
      <div className="md:px-10 md:py-16 relative z-[1] flex flex-col justify-center  px-5 py-12 text-center">
        <h1 className="lett md:text-[40px] md:mb-6 m-0  mb-2 text-4xl font-medium leading-none tracking-tight">
          {onEditPage ? "Edit List Settings" : "Create a New List"}
        </h1>
        <h3>
          Lists allows anyone to create fundraising initiatives for
          groundbreaking public goods.{" "}
          <a
            className="decoration-none hover:underline hover:opacity-60"
            target="_blank"
            href="https://potlock.org/learn-campaigns"
          >
            Learn more
          </a>
        </h3>
      </div>
    </div>
  );
};

export default CreateListtHero;
