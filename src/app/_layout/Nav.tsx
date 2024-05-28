"use client";

import { useCallback } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { walletApi } from "@/common/contracts";
import useIsClient from "@/common/hooks/useIsClient";
import { Button } from "@/common/ui/components/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import routesPath from "@/modules/core/routes";

const AuthButton = () => {
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();

  const loginHandler = useCallback(() => {
    walletApi.signInModal();
  }, []);

  const logoutHandler = useCallback(() => {
    walletApi.wallet?.signOut();
  }, []);

  if (!isClient) return;

  if (isAuthenticated) {
    return (
      <Button
        variant="standard-filled"
        onClick={logoutHandler}
        className="bg-[#342823]"
      >
        Logout
      </Button>
    );
  }

  return (
    <Button
      variant="standard-filled"
      onClick={loginHandler}
      className="bg-[#342823]"
    >
      Login
    </Button>
  );
};

const Nav = () => {
  const isClient = useIsClient();
  const pathname = usePathname();

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

  return (
    <nav className="container z-50 flex h-[110px] content-between items-center justify-between self-stretch bg-white px-[40px] pb-6 md:h-[96px] md:pr-2 md:pt-6">
      {/* Left */}
      <div className="flex">
        <div className="mr-12 flex flex-row items-center justify-center">
          {/* Logo */}
          <Link
            href="/"
            className="decoration-none hover:decoration-none mr-12 flex items-baseline gap-2 text-center text-2xl font-bold text-[color:var(--neutral-900)] sm:mr-4 sm:text-xl"
          >
            <Image
              src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
              alt="logo"
              width={28.72}
              height={23.94}
            />
            POTLOCK
          </Link>
        </div>

        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-row items-center justify-center">
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
        </div>
      </div>
      {/* Right */}
      <AuthButton />
    </nav>
  );
};

export default Nav;
