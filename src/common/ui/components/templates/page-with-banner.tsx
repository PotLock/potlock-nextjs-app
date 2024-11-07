export type PageWithBannerProps = {
  children: React.ReactNode;
};

export const PageWithBanner: React.FC<PageWithBannerProps> = ({ children }) => (
  <main
    className="2xl-container md:px-10 px px-5 pb-12"
    un-w="full"
    un-flex="~ col"
  >
    {children}
  </main>
);
