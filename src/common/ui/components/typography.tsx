import { cn } from "../utils";

export type TextWithIconProps = {
  content: string | number;
  lineHeight?: number;
  positioning?: "icon-text" | "text-icon";
  children: React.ReactNode;

  /**
   * Class applied to the text container
   */
  className?: string;
};

/**
 * Combination of text and icon with better vertical alignment
 */
export const TextWithIcon = ({
  content,
  lineHeight = 20,
  positioning = "text-icon",
  children,
  className,
}: TextWithIconProps) => {
  return (
    <div
      className="prose"
      un-flex="~"
      un-items="center"
      un-gap="2"
      style={{ height: lineHeight }}
    >
      {positioning === "icon-text" && children}

      <span un-line-height="none" className={cn("mt-0.6", className)}>
        {content}
      </span>

      {positioning === "text-icon" && children}
    </div>
  );
};
