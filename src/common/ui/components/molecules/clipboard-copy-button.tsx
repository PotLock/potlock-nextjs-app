import React, { ReactElement, useCallback, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { CopyPasteIcon } from "@/common/assets/svgs";

export type ClipboardCopyButtonProps = {
  customIcon?: ReactElement;
  text: string;
};

export const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({
  customIcon,
  text,
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return copied ? (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.8002 10.9L1.6002 6.69999L0.200195 8.09999L5.8002 13.7L17.8002 1.69999L16.4002 0.299988L5.8002 10.9Z"
        fill="#151A23"
      />
    </svg>
  ) : (
    <CopyToClipboard {...{ text, onCopy }}>
      <div className="h-4.5 w-4.5" title="Copy to clipboard">
        {customIcon ? customIcon : <CopyPasteIcon />}
      </div>
    </CopyToClipboard>
  );
};
