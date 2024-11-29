import React, { ReactNode, useMemo } from "react";

import InfiniteScrollWrapper, { Props as ScrollProps } from "react-infinite-scroll-component";

import { cn } from "../../utils";

export type InfiniteScrollProps = Partial<ScrollProps> & {
  items: any[];
  index: number;
  setIndex: (index: number) => void;
  size: number;
  renderItem: (props: any) => ReactNode;
  reversed?: boolean;
};

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  className,
  items,
  size,
  index,
  setIndex,
  renderItem,
  reversed,
}) => {
  const fetchMoreData = () => {
    setIndex(index + 1);
  };

  const orderedItems = useMemo(() => {
    const renderedItems = items.map(renderItem);

    return reversed ? renderedItems.toReversed() : renderedItems;
  }, [items, renderItem, reversed]);

  return (
    <InfiniteScrollWrapper
      className={cn("md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8", className)}
      dataLength={items.slice(0, size * index).length}
      next={fetchMoreData}
      scrollThreshold={1}
      hasMore={index < Math.ceil(items.length / size)}
      loader={<h4>Loading...</h4>}
    >
      {orderedItems}
    </InfiniteScrollWrapper>
  );
};
