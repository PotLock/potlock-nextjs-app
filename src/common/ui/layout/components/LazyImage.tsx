import { type ComponentType } from "react";

import { LazyLoadImage, type LazyLoadImageProps } from "react-lazy-load-image-component";

// Wrapper to satisfy React 18 JSX element typing for LazyLoadImage
export const LazyImage = LazyLoadImage as unknown as ComponentType<LazyLoadImageProps>;

export type { LazyLoadImageProps } from "react-lazy-load-image-component";
