import { useState } from "react";

import Link from "next/link";

import { PLATFORM_NAME } from "@/common/_config";
import { Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { CartLink } from "@/entities/cart";

import { NavigationMenuDesktop, NavigationMenuMobile } from "./navigation-menus";
import { UserMenu } from "./user-menu";

export const AppBar = () => {
  const walletUser = useWalletUserSession();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "2xl-container z-50 mx-auto flex w-full",
          "content-between items-center justify-between self-stretch",
          "bg-transparent px-5 py-3 md:h-[96px] md:px-10 md:py-6",
        )}
      >
        {/* Left */}
        <div className="flex">
          <div className="mr-12 flex flex-row items-center justify-center">
            <Link
              href="/"
              className={cn(
                "decoration-none hover:decoration-none",
                "mr-12 flex items-baseline gap-2 max-sm:mr-0 sm:mr-4",
              )}
            >
              <img alt="logo" src="/brand-logo.png" className="h-[23.94] w-[28.72]" />
              <p className="text-center text-xl font-bold max-sm:hidden">{PLATFORM_NAME}</p>
            </Link>
          </div>

          <NavigationMenuDesktop />
        </div>

        {/* Right */}
        <div className="flex items-center gap-8">
          <CartLink disabled />

          <button
            type="button"
            className="flex items-center justify-between focus:outline-none md:hidden"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="#7B7B7B" />
            </svg>
          </button>

          {walletUser.hasWalletReady ? <UserMenu /> : <Skeleton className="h-8 w-8 rounded-full" />}
        </div>
      </div>

      <NavigationMenuMobile open={isMobileNavOpen} />
    </>
  );
};
