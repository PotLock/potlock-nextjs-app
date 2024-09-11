import Link from "next/link";
import { BsCart } from "react-icons/bs";

import { Button } from "@/common/ui/components";
import routesPath from "@/modules/core/routes";

export const CartLink = () => {
  const numCartItems = Math.round(Math.random() * 5);

  return (
    <Button
      asChild
      variant="standard-plain"
      size="icon"
      className="rounded-full"
    >
      <Link href={routesPath.CART}>
        <BsCart />

        {numCartItems > 0 && (
          <div className="ml-2 flex h-[18px] w-[18px] flex-row items-center justify-center rounded-full bg-[#f86b3f]">
            <p className="ml-[-1px] mt-[2px] text-center text-[10px] font-bold">
              {numCartItems}
            </p>
          </div>
        )}
      </Link>
    </Button>
  );
};
