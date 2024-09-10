type Props = {
  width?: number;
  height?: number;
};

export const Spinner = ({ width = 18, height = 18 }: Props) => {
  return (
    <span
      className={`loader h-[${height}px] w-[${width}px] border-[2px]`}
    ></span>
  );
};

export default Spinner;
