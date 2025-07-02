import { Spinner } from "../atoms/spinner";

export const SpinnerOverlay = () => (
  <div className="bg-background fixed left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>
);
