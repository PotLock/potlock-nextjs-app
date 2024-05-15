"use client";

import { useCallback, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@app/common/components/button";
import useGetAccounts from "@app/hook/useGetAccounts";
import useIsClient from "@app/hook/useIsClient";
import useWallet from "@app/hook/useWallet";
import { walletApi } from "@app/services/contracts";
import * as socialDb from "@app/services/contracts/social";
import { dispatch, useTypedSelector } from "@app/store";

export default function Home() {
  const isClient = useIsClient();
  const wallet = useWallet();

  // ==== Example of wallet info access ====
  useEffect(() => {
    if (wallet.isWalletReady) {
      console.log("Wallet Status:", wallet);

      // ==== Example of contract call ====
      (async () => {
        const userProfileInfo = await socialDb.get_user_profile({
          accountId: "wendersonpires.near",
        });
        console.log("User Profile Info:", userProfileInfo);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isWalletReady]);

  // ==== Example of store usage ====
  const { name } = useTypedSelector((state) => state.user);

  useEffect(() => {
    // ==== Example of store usage ====
    if (!name) {
      dispatch.user.setUserData({ name: Date.now().toString() });
    }
  }, [name]);

  // ==== Example of service usage with custom hooks & react-query ====
  const { isPending, data } = useGetAccounts();

  useEffect(() => {
    if (!isPending) {
      console.log("Accounts:", data);
    }
  }, [isPending, data]);

  // ==== Handlers ====
  const changeUserName = useCallback(() => {
    dispatch.user.setUserData({ name: Date.now().toString() });
  }, []);

  const signInHandler = useCallback(() => {
    walletApi.signInModal();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          User name:&nbsp;
          {isClient ? (
            <code className="font-mono font-bold">{name}</code>
          ) : (
            <code className="font-mono font-bold">Loading...</code>
          )}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <Link href="/project">Go to project page</Link>

      <Button font="bold" onClick={changeUserName}>
        Change User Name
      </Button>

      <Button font="bold" onClick={signInHandler}>
        Sign In
      </Button>
    </main>
  );
}
