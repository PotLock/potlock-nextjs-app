"use client";

import { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { walletApi } from "@/common/contracts";
import useIsClient from "@/common/lib/useIsClient";
import { Button } from "@/common/ui/components";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import routesPath from "@/modules/core/routes";

import UserDropdown from "../_components/UserDropdown";

const tabOptions = [
  {
    text: "Projects",
    link: routesPath.PROJECTS_LIST,
    disabled: false,
  },
  { text: "Feed", link: "feed", disabled: false },
  {
    text: "Pots",
    link: routesPath.POTS,
    disabled: false,
  },
  {
    text: "Donors",
    link: routesPath.DONORS,
    disabled: false,
  },
];

const AuthButton = () => {
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();

  const loginHandler = useCallback(() => {
    walletApi.signInModal();
  }, []);

  if (!isClient) return;

  if (isAuthenticated) {
    return <UserDropdown />;
  }

  return (
    <Button
      font="semibold"
      variant="standard-filled"
      onClick={loginHandler}
      className="border-none bg-[#342823] shadow-none"
    >
      Sign In
    </Button>
  );
};

const MobileMenuButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="flex items-center justify-between focus:outline-none md:hidden"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
          fill="#7B7B7B"
        />
      </svg>
    </button>
  );
};

const MobileNav = () => {
  const isClient = useIsClient();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4 p-6">
      {tabOptions.map((tab) => {
        const selected = isClient ? tab.link === pathname : false;

        return (
          <Link
            key={tab.text}
            href={tab.link}
            className={`${selected ? "font-medium text-[color:var(--neutral-900)]" : "font-normal text-[color:var(--neutral-500)]"} decoration-none not-last-child hover:decoration-none relative mr-8 text-sm`}
          >
            {tab.text}
          </Link>
        );
      })}
    </nav>
  );
};

const CartLink = () => {
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

const Nav = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isClient = useIsClient();
  const pathname = usePathname();

  return (
    <div>
      <nav className="container z-50 flex content-between items-center justify-between self-stretch bg-white px-[40px] pb-6 pt-6 max-sm:px-1 md:h-[96px] md:pr-2">
        {/* Left */}
        <div className="flex">
          <div className="mr-12 flex flex-row items-center justify-center">
            {/* Logo */}
            <Link
              href="/"
              className="decoration-none hover:decoration-none mr-12 flex items-baseline gap-2 max-sm:mr-0 sm:mr-4"
            >
              <Image
                src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
                alt="logo"
                width={28.72}
                height={23.94}
              />
              <p className="text-center text-xl font-bold text-[color:var(--neutral-900)] max-sm:hidden">
                POTLOCK
              </p>
            </Link>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-center justify-center max-md:hidden">
              {tabOptions.map((tab) => {
                const selected = isClient ? tab.link === pathname : false;

                return (
                  <Link
                    key={tab.text}
                    href={tab.link}
                    className={`${selected ? "font-medium text-[color:var(--neutral-900)]" : "font-normal text-[color:var(--neutral-500)]"} decoration-none not-last-child hover:decoration-none relative mr-8 text-sm`}
                  >
                    {tab.text}
                  </Link>
                );
              })}
            </div>
            <CartLink />
          </div>
        </div>
        {/* Right */}
        <div className="flex gap-4">
          <AuthButton />
          <MobileMenuButton
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
            }}
          />
        </div>
      </nav>
      {/* Mobile Nav */}
      <div className="md:hidden">{showMobileMenu && <MobileNav />}</div>
    </div>
  );
};

export default Nav;
