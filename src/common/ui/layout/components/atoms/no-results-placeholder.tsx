import { cn } from "../../utils";

export type NoResultsPlaceholderProps = {
  text: string;
};

export const NoResultsPlaceholder: React.FC<NoResultsPlaceholderProps> = ({ text }) => (
  <div
    className={cn(
      "flex flex-col-reverse items-center justify-between",
      "rounded-[12px] bg-[#f6f5f3] px-[24px] py-[16px] md:flex-col md:px-[105px] md:py-[68px]",
    )}
  >
    <p
      className={cn(
        "font-italic font-500 font-lora mb-4 max-w-[290px]",
        "text-nowrap text-center text-[16px] text-[#292929] md:text-[22px]",
      )}
    >
      {text}
    </p>

    <img
      className="w-[50%]"
      src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de"
      alt="pots"
    />
  </div>
);
