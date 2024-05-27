"use client";

import { useCallback, useEffect } from "react";

import Hero from "@app/modules/homepage/Hero";
import { dispatch, useTypedSelector } from "@app/store";
import { walletApi } from "@contracts/index";
import useWallet from "@modules/auth/hooks/useWallet";
import { Button } from "@modules/core/common/button";
import useGetAccounts from "@modules/core/hook/useGetAccounts";
import useIsClient from "@modules/core/hook/useIsClient";

export default function Home() {
  const isClient = useIsClient();
  const wallet = useWallet();

  // ==== Example of wallet info access ====
  useEffect(() => {
    if (wallet.isWalletReady) {
      console.log("Wallet Status:", wallet);

      // ==== Example of contract call ====
      // (async () => {
      //   const userProfileInfo = await socialDb.get_user_profile({
      //     accountId: "wendersonpires.near",
      //   });
      //   console.log("User Profile Info:", userProfileInfo);
      // })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isWalletReady]);

  // ==== Example of store usage ====
  const { name } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    // ==== Example of store usage ====
    if (!name) {
      dispatch.auth.setAuthData({
        name: Date.now().toString(),
        isSignedIn: false,
      });
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
    <main className="flex flex-col items-center">
      <Hero />
    </main>
  );
}
{
  /* <Button variant={"brand-tonal"} onClick={changeUserName}>
Change User Name
</Button>

<Button onClick={signInHandler}>Sign In</Button> */
}
