"use client";

import dynamic from "next/dynamic";

export default dynamic(() => import("./_page"), {
  ssr: false,
});
