import { useCallback, useState } from "react";

import { cn } from "../utils";

export const useImgVisibilityToggle = () => {
  const [isImgVisible, setIsImgVisibility] = useState(false);
  const displayImg = useCallback(() => setIsImgVisibility(true), []);
  const imgVisibilityClassName = cn({ "display-[none]": !isImgVisible });

  return { imgVisibilityClassName, displayImg };
};
