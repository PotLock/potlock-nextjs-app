declare module "react-files" {
  function Files(props: {
    className?: string;
    onChange?: (e: any) => void;
    onError?: (e: any) => void;
    accepts: string[];
    multiple?: boolean;
    maxFileSize?: number;
    minFileSize?: number;
    clickable?: boolean;
    style?: {};
  }): JSX.Element;
  export default Files;
}

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare module "react" {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
