import Link from "next/link";
import { values } from "remeda";

import { CartIcon } from "@/common/assets/svgs";
import { Button, ButtonProps } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { hrefByRouteName } from "@/modules/core";

import { useCart } from "../hooks";

export type CartLinkProps = Pick<ButtonProps, "disabled"> & {};

export const CartLink: React.FC<CartLinkProps> = ({ disabled }) => {
  const { items } = useCart();
  const numberOfItems = values(items ?? {}).length;

  return (
    <Button
      asChild
      variant="standard-plain"
      size="icon"
      title={disabled ? "🚧 Work In Progress 🚧" : undefined}
      className={cn("rounded-full p-1", {
        "cursor-not-allowed opacity-20": disabled,
      })}
      {...{ disabled }}
    >
      <Link href={disabled ? hrefByRouteName.CURRENT : hrefByRouteName.CART}>
        <CartIcon width={24} height={24} />

        {numberOfItems > 0 && (
          <div className="ml-2 flex h-[18px] w-[18px] flex-row items-center justify-center rounded-full bg-[#f86b3f]">
            <p className="ml-[-1px] mt-[2px] text-center text-[10px] font-bold">
              {numberOfItems}
            </p>
          </div>
        )}
      </Link>
    </Button>
  );
};
