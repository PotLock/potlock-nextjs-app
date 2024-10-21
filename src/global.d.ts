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

declare module "*.svg" {
  import { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: any;
  export default content;
}
