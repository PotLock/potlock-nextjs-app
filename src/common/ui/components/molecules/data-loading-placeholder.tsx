import { cn } from "../../utils";
import { Spinner } from "../Spinner";
import { LabeledIcon } from "../atoms/typography";

export type DataLoadingPlaceholderProps = { className?: string; text?: string };

export const DataLoadingPlaceholder: React.FC<DataLoadingPlaceholderProps> = ({
  text = "Loading...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        className,
      )}
    >
      <LabeledIcon
        caption={text}
        positioning="icon-text"
        classNames={{ root: "gap-4", caption: "font-400 text-2xl" }}
      >
        <Spinner width={24} height={24} />
      </LabeledIcon>
    </div>
  );
};
