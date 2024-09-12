import Link from "next/link";
import { values } from "remeda";

import { CartIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";
import { useCart } from "@/modules/cart/hooks";
import routesPath from "@/modules/core/routes";

export const CartLink = () => {
  const { orders } = useCart();
  const numberOfOrders = values(orders).length;

  return (
    <Button
      asChild
      variant="standard-plain"
      size="icon"
      className="rounded-full p-1"
    >
      <Link href={routesPath.CART}>
        <CartIcon width={24} height={24} />

        {numberOfOrders > 0 && (
          <div className="ml-2 flex h-[18px] w-[18px] flex-row items-center justify-center rounded-full bg-[#f86b3f]">
            <p className="ml-[-1px] mt-[2px] text-center text-[10px] font-bold">
              {numberOfOrders}
            </p>
          </div>
        )}
      </Link>
    </Button>
  );
};
