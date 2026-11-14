import { useMemo } from "react";

import type { LabelProps } from "@radix-ui/react-label";

import { cn } from "../../utils";

export type LabeledIconProps = Pick<LabelProps, "htmlFor"> & {
  bold?: boolean;
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
  bold = false,
  caption,
  hint,
  href,
  htmlFor,
  lineHeight = 20,
  positioning = "text-icon",
  children,
  classNames,
}: LabeledIconProps) => {
  const labelClassName = cn(
    "mt-0.8 leading-none",
    { "font-medium": bold, "font-normal": !bold },
    classNames?.caption,
  );

  const labelElement = useMemo(
    () =>
      href ? (
        <a
          target="_blank"
          title={hint}
          {...{ href, htmlFor }}
          className={cn(labelClassName, "decoration-none hover:underline")}
        >
          {caption}
        </a>
      ) : (
        <span title={hint} {...{ htmlFor }} className={labelClassName}>
          {caption}
        </span>
      ),

    [caption, hint, href, htmlFor, labelClassName],
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
