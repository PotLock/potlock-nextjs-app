import { cn } from "../../utils";

export type SpinnerProps = {
  /**
   * @deprecated Use `className
   */
  width?: number;

  /**
   * @deprecated Use `className
   */
  height?: number;

  className?: string;
};

export const Spinner: React.FC<SpinnerProps> = ({ width = 18, height = 18, className }) => {
  return (
    <span
      className={cn("loader border-[2px]", className)}
      style={className ? undefined : { width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default Spinner;
