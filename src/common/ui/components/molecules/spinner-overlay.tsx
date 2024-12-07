import { Spinner } from "../atoms/spinner";

export const SpinnerOverlay = () => (
  <div
    className="fixed z-[999] flex h-screen w-screen items-center justify-center"
    style={{ top: 0, left: 0, background: "transparent" }}
  >
    <Spinner width={32} height={32} />
  </div>
);
