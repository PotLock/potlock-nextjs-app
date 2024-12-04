export type PageWithBannerProps = {
  children: React.ReactNode;
};

export const PageWithBanner: React.FC<PageWithBannerProps> = ({ children }) => (
  <main className="2xl-container px-5 pb-12 md:px-10" un-w="full" un-flex="~ col">
    {children}
  </main>
);
