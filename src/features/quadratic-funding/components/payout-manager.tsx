import Link from "next/link";

import type { ByPotId } from "@/common/api/indexer";

export type QuadraticFundingPayoutManagerProps = ByPotId & {};

export const QuadraticFundingPayoutManager: React.FC<QuadraticFundingPayoutManagerProps> = ({
  potId: _,
}) => {
  return (
    <div className="prose">
      <h1 className="uppercase">{"🚧 Work in progress 🚧"}</h1>

      <p className="inline-flex gap-1">
        <span>{"Please use the"}</span>

        <Link href="https://bos.potlock.org/" target="_blank">
          {"BOS app"}
        </Link>

        <span>{"to manage Quadratic Funding payouts in the meantime."}</span>
      </p>
    </div>
  );
};
