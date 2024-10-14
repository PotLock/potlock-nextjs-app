import Trophy from "@/common/assets/svgs/Trophy";

interface LeaderboardCardProps {
  rank: number;
  image: string;
  name: string;
  amount: number;
  type: "donor" | "sponsor";
}

export function LeaderboardCard({
  rank,
  image,
  name,
  amount,
  type,
}: LeaderboardCardProps) {
  const bgClass =
    rank === 1
      ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
      : rank === 2
        ? "bg-gray-200"
        : "bg-gradient-to-r from-orange-200 to-red-200";

  const rankText = ["1st", "2nd", "3rd"][rank - 1];
  const iconClass =
    rank === 1
      ? "fill-yellow-400"
      : rank === 2
        ? "fill-gray-400"
        : "fill-red-800";

  return (
    <div
      className={`min-w-fit overflow-hidden rounded-2xl border border-gray-200 pb-4`}
    >
      <div className={`mb-4 flex items-center justify-between p-4 ${bgClass}`}>
        <div className={`p-2`}>
          <Trophy className={`h-6 w-6 ${iconClass}`} />
        </div>
        <span className="text-lg font-bold">{rankText}</span>
      </div>
      <img
        src={image ?? ""}
        alt={name}
        className="mx-auto mb-4 h-20 w-20 rounded-full"
      />
      <p className="mb-2 text-center font-semibold">{name}</p>
      <p className="text-center text-2xl font-bold">
        {amount}{" "}
        <span className="text-sm">
          NEAR {type === "donor" ? "Donated" : "Sponsored"}
        </span>
      </p>
    </div>
  );
}
