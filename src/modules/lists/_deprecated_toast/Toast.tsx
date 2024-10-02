import React, { useEffect } from "react";

import Image from "next/image";

import { dispatch, useTypedSelector } from "@/store";

import { listRegistrationStatuses } from "../constants";
import { ListFormModalType } from "../types";

export const Toast: React.FC = () => {
  const toast = useTypedSelector((state) => state.toast);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch.toast.reset();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!toast.show) return null;

  return (
    toast.message && (
      <div
        style={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
        className="md:w-[498px] top-15 fixed right-4 z-20 flex w-[50%] items-center justify-between rounded bg-white p-4 text-black shadow-lg"
      >
        <div className="flex items-center gap-3">
          {toast.listType === ListFormModalType.UPDATE_ACCOUNT && (
            <Image
              width={18}
              height={18}
              // @ts-expect-error This won't work because of the type mismatch
              //! ( UPDATE_ACCOUNT is not a list registration status )
              src={listRegistrationStatuses[toast.listType].icon}
              alt="icon"
            />
          )}

          <span>{toast.message}</span>
        </div>
        <span
          onClick={() => dispatch.toast.reset()}
          className="cursor-pointer font-semibold"
        >
          X
        </span>
      </div>
    )
  );
};
