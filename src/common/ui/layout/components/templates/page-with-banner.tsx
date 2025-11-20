import { cn } from "../../utils";

export type PageWithBannerProps = {
  className?: string;
  children: React.ReactNode;
};

export const PageWithBanner: React.FC<PageWithBannerProps> = ({ className, children }) => (
  <main className={cn("2xl-container flex w-full flex-col px-5 pb-8 md:px-10", className)}>
    {children}
  </main>
);
