import Link from "next/link";

import routesPath from "@/modules/core/routes";

export const CartLink = () => {
  // TODO: number of cart items
  const numCartItems = Math.round(Math.random() * 5);

  return (
    <Link
      href={routesPath.CART}
      className="flex flex-row items-center justify-center rounded-[6px] bg-[rgb(46,46,46)] px-4 py-[9.5px] text-[14px] font-semibold text-white"
    >
      Cart
      {numCartItems > 0 && (
        <div className="ml-2 flex h-[18px] w-[18px] flex-row items-center justify-center rounded-full bg-[#f86b3f]">
          <p className="ml-[-1px] mt-[2px] text-center text-[10px] font-bold">
            {numCartItems}
          </p>
        </div>
      )}
    </Link>
  );
};
