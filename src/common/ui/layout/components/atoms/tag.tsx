import { cn } from "../../utils";

export type TagProps = { label: string };

export const Tag: React.FC<TagProps> = ({ label }) => (
  <div
    className={cn(
      "flex items-center justify-center gap-2 overflow-hidden rounded-md",
      "border border-zinc-950/10 bg-neutral-100 px-3 py-1.5",
      "shadow-[inset_0px_1px_0px_1px_rgba(255,255,255,0.80)]",
    )}
  >
    <div className="text-xs font-medium leading-none text-zinc-800">{label}</div>
  </div>
);
