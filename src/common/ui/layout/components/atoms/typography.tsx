import { useMemo } from "react";

import { cn } from "../../utils";

export type LabeledIconProps = {
  caption: string | number;
  hint?: string;
  href?: string;
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
  hint,
  href,
  lineHeight = 20,
  positioning = "text-icon",
  children,
  classNames,
}: LabeledIconProps) => {
  const labelClassName = cn("mt-0.8 font-400 leading-none", classNames?.caption);

  const labelElement = useMemo(
    () =>
      href ? (
        <a
          target="_blank"
          title={hint}
          {...{ href }}
          className={cn(labelClassName, "decoration-none hover:underline")}
        >
          {caption}
        </a>
      ) : (
        <span title={hint} className={labelClassName}>
          {caption}
        </span>
      ),

    [caption, hint, href, labelClassName],
  );

  return (
    <div
      className={cn("prose flex items-center gap-2", classNames?.root)}
      style={{ height: lineHeight }}
    >
      {positioning === "icon-text" && children}
      {labelElement}
      {positioning === "text-icon" && children}
    </div>
  );
};
