"use client";

import { useCallback, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

export type ClipboardCopyButtonProps = {
  text: string;
};

export const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({
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
      <svg
        className="cursor-pointer transition-all ease-in-out hover:scale-[1.1]"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.375 0.75L3.375 0.75C2.55 0.75 1.875 1.425 1.875 2.25L1.875 12.75H3.375L3.375 2.25L12.375 2.25V0.75ZM14.625 3.75L6.375 3.75C5.55 3.75 4.875 4.425 4.875 5.25L4.875 15.75C4.875 16.575 5.55 17.25 6.375 17.25H14.625C15.45 17.25 16.125 16.575 16.125 15.75V5.25C16.125 4.425 15.45 3.75 14.625 3.75ZM14.625 15.75L6.375 15.75L6.375 5.25L14.625 5.25L14.625 15.75Z"
          fill="#A6A6A6"
        />
      </svg>
    </CopyToClipboard>
  );
};
