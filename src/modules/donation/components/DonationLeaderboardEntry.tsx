import Image from "next/image";

import Trophy from "@/common/assets/svgs/Trophy";

export type DonationLeaderboardEntryProps = {
  rank: number;
  image: string;
  name: string;
  amount: number;
  type: "donor" | "sponsor";
};

export const DonationLeaderboardEntry: React.FC<
  DonationLeaderboardEntryProps
> = ({ rank, image, name, amount, type }) => {
  const bgClass =
    rank === 1
      ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
      : rank === 2
        ? "bg-gradient-to-r from-#F7F7F7 to-#DBDBDB"
        : "bg-gradient-to-r from-#FCE9D5 to-#F8D3B0";

  const rankText = ["1st", "2nd", "3rd"][rank - 1];
  const iconClass =
    rank === 1
      ? "fill-yellow-400"
      : rank === 2
        ? "fill-gray-400"
        : "fill-red-800";

  return (
    <div
      className={`w-288px overflow-hidden rounded-2xl border border-gray-200 pb-4`}
    >
      <div className={`flex items-center justify-between p-4 ${bgClass}`}>
        <div>
          <Trophy className={`h-6 w-6 ${iconClass}`} />
        </div>
        <span className="text-lg font-bold">{rankText}</span>
      </div>
      <div className="p-20px flex flex-col items-center">
        <Image
          src={image ?? ""}
          alt={name}
          className="mb-12px h-20 w-20 rounded-full"
          width={80}
          height={80}
        />
        <p className="font-500 text-#292929 font-14px mb-2 text-center">
          {name}
        </p>
        <p className="font-600 text-center text-2xl">
          {amount}{" "}
          <span className="text-#292929 font-600 text-sm">
            NEAR {type === "donor" ? "Donated" : "Sponsored"}
          </span>
        </p>
      </div>
    </div>
  );
};
