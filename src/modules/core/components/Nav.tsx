import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useIsClient from "@/common/lib/useIsClient";
import { SignInButton } from "@/modules/auth";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { CartLink } from "@/modules/cart";

import { UserDropdown } from "./UserDropdown";
import routesPath from "../routes";

const tabOptions = [
  { text: "Projects", link: routesPath.PROJECTS_LIST, disabled: false },
  { text: "Feed", link: "feed", disabled: false },
  { text: "Pots", link: routesPath.POTS, disabled: false },
  // { text: "Donors", link: routesPath.DONORS, disabled: false },
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
      {tabOptions.map((tab) => {
        const selected = isClient ? tab.link === router.pathname : false;

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

export const Nav = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isClient = useIsClient();
  const router = useRouter();

  return (
    <>
      <nav
        un-w="full"
        className="max-sm:px-1 md:h-[96px] md:pr-2 container z-50 flex content-between items-center justify-between self-stretch bg-transparent px-[40px] pb-6 pt-6"
      >
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
              <p className="max-sm:hidden text-center text-xl font-bold text-[color:var(--neutral-900)]">
                POTLOCK
              </p>
            </Link>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="max-md:hidden flex flex-row items-center justify-center">
              {tabOptions.map((tab) => {
                const selected = isClient
                  ? tab.link === router.pathname
                  : false;

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
    </>
  );
};
