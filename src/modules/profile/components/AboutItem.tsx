type Props = {
  title: string;
  text?: string;
  element?: React.ReactNode;
};

const AboutItem = ({ title, text, element }: Props) => {
  return (
    <div className="mt-8 flex w-full flex-col items-start justify-start md:flex-row">
      <div className="mb-4 flex w-full md:w-[358px]">
        <p className="text-size-base font-600 text-[#2e2e2e]">{title}</p>
      </div>
      {text && <p className="m-0 flex w-full flex-col">{text}</p>}
      {element && element}
    </div>
  );
};

export default AboutItem;
