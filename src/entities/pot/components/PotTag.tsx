export type PotTagProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  text: string;
  preElements?: React.ReactNode;
};

export const PotTag: React.FC<PotTagProps> = ({
  backgroundColor,
  borderColor,
  textColor,
  text,
  preElements,
}) => (
  <div
    className="flex items-center justify-center rounded-[4px] px-[8px] py-[6px] text-center"
    style={{
      backgroundColor: backgroundColor || "#ffffff",
      border: `1px solid ${borderColor || "#000000"}`,
      boxShadow: `0px -0.699999988079071px 0px ${borderColor} inset`,
    }}
  >
    {preElements}

    <p
      className="text-size-sm font-500 ml-2"
      style={{
        color: textColor || "#000000",
      }}
    >
      {text}
    </p>
  </div>
);
