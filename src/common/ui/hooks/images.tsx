/**
 * WARNING: keep `.tsx` extension for this file,
 *  otherwise styles for the visibility className might not be generated
 */

import { useCallback, useState } from "react";

import { cn } from "../utils";

export const useImgVisibilityToggle = () => {
  const [isImgVisible, setIsImgVisibility] = useState(false);
  const displayImg = useCallback(() => setIsImgVisibility(true), []);
  const imgVisibilityClassName = cn({ "not-displayed": !isImgVisible });

  return { imgVisibilityClassName, displayImg };
};
