export const Row = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div className="grid grid-cols-2 gap-6 max-md:grid-cols-[100%]">
    {children}
  </div>
);

export const InputContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div className="flex w-full flex-col items-start justify-start gap-[0.45em] p-0 text-[14px]">
    {children}
  </div>
);

export const Label = ({ children }: { children: JSX.Element | string }) => (
  <div className="font-500 line-height-[16px] color-neutral-900 break-words text-[14px]">
    {children}
  </div>
);
