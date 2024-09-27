import { cn } from "../../utils";

export type LabeledIconProps = {
  caption: string | number;
  lineHeight?: number;
  positioning?: "icon-text" | "text-icon";
  children: React.ReactNode;

  classNames?: {
    root?: string;
    caption?: string;
  };
};

/**
 * Combination of text and icon with better vertical alignment
 */
export const LabeledIcon = ({
  caption,
  lineHeight = 20,
  positioning = "text-icon",
  children,
  classNames,
}: LabeledIconProps) => {
  return (
    <div
      className={cn("prose flex items-center gap-2", classNames?.root)}
      style={{ height: lineHeight }}
    >
      {positioning === "icon-text" && children}

      <span un-line-height="none" className={cn("mt-0.8", classNames?.caption)}>
        {caption}
      </span>

      {positioning === "text-icon" && children}
    </div>
  );
};
