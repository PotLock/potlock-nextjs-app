export type PageWithBannerProps = {
  children: React.ReactNode;
};

export const PageWithBanner: React.FC<PageWithBannerProps> = ({ children }) => (
  <main className="2xl-container flex w-full flex-col px-5 pb-8 md:px-10">{children}</main>
);
