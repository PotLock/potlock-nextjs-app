import Link from "next/link";

const PotCard = () => {
  return (
    <Link className="flex h-full min-h-[300px] min-w-[320px] flex-col rounded-[8px] bg-white pb-1.5 shadow-[inset_0px_-2px_0px_0px_#464646,0px_0px_0px_1px_#464646] hover:cursor-pointer hover:no-underline">
      {/* Card Section */}
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 p-8">
        {/* Title */}
        <h2 className="break-words text-[22px] font-semibold leading-[28px] text-[#292929]">
          Title here
        </h2>
        <p className="markdown-link break-words text-[16px] font-normal leading-[28px] text-[#525252]">
          Description here (pot_description) - support markdown?
        </p>
      </div>
      {/* Card Section */}
      <div className="mt-auto flex h-fit h-full w-full flex-col items-start justify-start gap-4 border-t border-[#7B7B7B] bg-[#f6f5f3] p-8">
        {/* Title */}
        <h2 className="flex items-baseline break-words text-[22px] font-semibold leading-[28px] text-[#292929]">
          N 123 <br />
          {/* {amountNear} */}
          <span className="ml-1 text-[14px] font-normal">12$</span> <br />
          {/* {amountUsd && <span className="usd-amount">{amountUsd}</span>} */}
          <span className="ml-2 text-[14px] text-[#7b7b7b]">in pot</span>
        </h2>
        {/* {tags.map((tag) =>
          tag.visibility ? (
            <Tag {...tag} preElements={<Indicator {...(tag.preElementsProps || {})} />} key={tag.text} />
          ) : (
            ""
          ),
        )} */}
      </div>
    </Link>
  );
};

export default PotCard;
