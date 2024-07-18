import React from "react";

import Spinner from "./Spinner";

const ScreenSpinner = () => (
  <div
    className="fixed z-[999] flex h-screen w-screen items-center justify-center"
    style={{ top: 0, left: 0, background: "rgba(255, 255, 255, 0.9)" }}
  >
    <Spinner width={32} height={32} />
  </div>
);

export default ScreenSpinner;
