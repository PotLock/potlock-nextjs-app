"use client";

import { useEffect } from "react";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { Provider as ReduxProvider } from "react-redux";

import { dispatch, store } from "@/app/_store";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

export type RootProviderProps = {
  children: React.ReactNode;
};

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  useEffect(() => {
    dispatch.core.fetchNearToUsd();
  }, []);

  return (
    <ReduxProvider store={store}>
      <NiceModalProvider>
        <AuthProvider>{children}</AuthProvider>
      </NiceModalProvider>
    </ReduxProvider>
  );
};
