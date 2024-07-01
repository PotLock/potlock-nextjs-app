import { ReactNode } from "react";

import InfiniteScrollWrapper, {
  Props as ScrollProps,
} from "react-infinite-scroll-component";

import { cn } from "../utils";

type Props = Partial<ScrollProps> & {
  items: any[];
  index: number;
  setIndex: (index: number) => void;
  size: number;
  renderItem: (props: any) => ReactNode;
};

export const InfiniteScroll = ({
  className,
  items,
  size,
  index,
  setIndex,
  renderItem,
}: Props) => {
  const fetchMoreData = () => {
    setIndex(index + 1);
  };

  return (
    <InfiniteScrollWrapper
      className={cn(
        "mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      dataLength={items.slice(0, size * index).length}
      next={fetchMoreData}
      scrollThreshold={1}
      hasMore={index < Math.ceil(items.length / size)}
      loader={<h4>Loading...</h4>}
    >
      {items
        .slice(0, size * index)
        .map((registration) => renderItem(registration))}
    </InfiniteScrollWrapper>
  );
};
