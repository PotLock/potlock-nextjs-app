export type EditorSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  heading?: string;
};

export const EditorSection = ({ heading, children }: EditorSectionProps) => {
  return (
    <section className="lg:flex-row lg:gap-8 flex flex-col gap-4">
      <h2 className="prose font-600 lg:w-50 w-full">{heading}</h2>

      <div className="max-w-160 flex w-full flex-col gap-8">{children}</div>
    </section>
  );
};
