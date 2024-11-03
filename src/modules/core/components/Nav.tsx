import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { DEBUG } from "@/common/constants";
import useIsClient from "@/common/lib/useIsClient";
import { cn } from "@/common/ui/utils";
import { SignInButton, useAuth } from "@/modules/auth";
import { CartLink } from "@/modules/cart";

import { UserDropdown } from "./UserDropdown";
import routesPath, { hrefByRouteName } from "../routes";

const links = [
  { label: "Projects", url: routesPath.PROJECTS_LIST, disabled: false },
  { label: "Pots", url: routesPath.POTS, disabled: false },
  { label: "Campaigns", url: routesPath.CAMPAIGNS, disabled: false },

  { label: "Feed", url: routesPath.FEED, disabled: false },
  // { label: "Donors", url: routesPath.DONORS, disabled: false },

  {
    label: "Lists",
    url: routesPath.LIST,
    disabled: false,
  },
];

const AuthButton = () => {
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();

  if (!isClient) return;

  return isAuthenticated ? <UserDropdown /> : <SignInButton />;
};

const MobileMenuButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="md:hidden flex items-center justify-between focus:outline-none"
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
  const router = useRouter();

  return (
    <nav className="flex flex-col gap-4 p-6">
      {links.map(({ url, label, disabled }) => {
        const isActive = isClient ? url === router.pathname : false;

        return (
          <Link
            key={url + label}
            href={disabled ? hrefByRouteName.CURRENT : url}
            className={cn(
              "decoration-none not-last-child hover:decoration-none relative mr-8 text-sm",

              {
                "cursor-not-allowed opacity-20": disabled,
                "font-medium": isActive,
                "font-normal text-neutral-500": !isActive,
              },
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export const Nav = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isClient = useIsClient();
  const router = useRouter();

  return (
    <>
      <nav className="max-sm:px-1 md:h-[96px] 2xl-container z-50 mx-auto flex w-full content-between items-center justify-between self-stretch bg-transparent px-10 pb-6 pt-6">
        {/* Left */}
        <div className="flex">
          <div className="mr-12 flex flex-row items-center justify-center">
            {/* Logo */}
            <Link
              href="/"
              className="decoration-none hover:decoration-none max-sm:mr-0 sm:mr-4 mr-12 flex items-baseline gap-2"
            >
              <Image
                src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
                alt="logo"
                width={28.72}
                height={23.94}
              />

              <p className="max-sm:hidden text-center text-xl font-bold">
                {"POTLOCK"}
              </p>
            </Link>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="max-md:hidden flex flex-row items-center justify-center">
              {links.map(({ url, label, disabled }) => {
                const isActive = isClient ? url === router.pathname : false;
                return (
                  <Link
                    key={url + label}
                    href={disabled ? hrefByRouteName.CURRENT : url}
                    className={cn(
                      "decoration-none not-last-child hover:decoration-none relative mr-8 text-sm",

                      {
                        "cursor-not-allowed opacity-20": disabled,
                        "font-medium": isActive,
                        "font-normal text-neutral-500": !isActive,
                      },
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-8">
          <CartLink disabled />
          <AuthButton />

          <MobileMenuButton
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden">{showMobileMenu && <MobileNav />}</div>
    </>
  );
};
