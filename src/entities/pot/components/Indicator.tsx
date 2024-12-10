type Props = {
  colorOuter: string;
  colorInner: string;
  animate?: boolean;
};

export const Indicator = ({ animate, colorInner, colorOuter }: Props) => {
  return (
    <div
      className="flex h-[18px] w-[18px] animate-beacon items-center justify-center rounded-full"
      style={{
        backgroundColor: colorOuter,
        animationPlayState: animate ? "running" : "paused",
      }}
    >
      <div className="h-[10px] w-[10px] rounded-[50%]" style={{ backgroundColor: colorInner }} />
    </div>
  );
};

export default Indicator;
