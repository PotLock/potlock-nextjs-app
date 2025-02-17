import { PLATFORM_NAME } from "@/common/_config";
import { cn } from "@/common/ui/utils";

export type SplashScreenProps = {
  className?: string;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ className }) => (
  <div
    className={cn("min-h-105 flex h-full w-full flex-col items-center justify-center", className)}
  >
    <span className="spinner"></span>

    <div className={cn("hover:decoration-none decoration-none mt-6 flex items-baseline gap-2")}>
      <img src="/favicon.png" alt="logo" width={28.72} height={23.94} />

      <span
        className={cn("prose text-2xl font-bold uppercase text-neutral-950 max-[480px]:text-lg")}
      >
        {PLATFORM_NAME}
      </span>
    </div>
  </div>
);
