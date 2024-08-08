import { useCallback, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

export type ClipboardCopyButtonProps = {
  iconType?: "copy-paste" | "volunteer";
  text: string;
};

export const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({
  iconType = "copy-paste",
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
      <div className="h-[18px] w-[18px]">
        {iconType === "copy-paste" && (
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
        )}

        {iconType === "volunteer" && (
          <svg
            className="cursor-pointer transition-all ease-in-out hover:scale-[1.1]"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.375 9.5625C14.6925 7.455 16.875 5.4825 16.875 3.7875C16.875 2.4 15.7875 1.3125 14.4 1.3125C13.62 1.3125 12.8625 1.68 12.375 2.25C11.88 1.68 11.13 1.3125 10.35 1.3125C8.9625 1.3125 7.875 2.4 7.875 3.7875C7.875 5.4825 10.0575 7.455 12.375 9.5625ZM10.35 2.8125C10.68 2.8125 11.0175 2.97 11.235 3.225L12.375 4.5675L13.515 3.225C13.7325 2.97 14.07 2.8125 14.4 2.8125C14.955 2.8125 15.375 3.2325 15.375 3.7875C15.375 4.6275 13.845 6.165 12.375 7.53C10.905 6.165 9.375 4.62 9.375 3.7875C9.375 3.2325 9.795 2.8125 10.35 2.8125Z"
              fill="#7B7B7B"
            />
            <path
              d="M14.625 11.8125H13.125C13.125 10.9125 12.5625 10.1025 11.7225 9.7875L7.1025 8.0625H1.125V16.3125H5.625V15.2325L10.875 16.6875L16.875 14.8125V14.0625C16.875 12.8175 15.87 11.8125 14.625 11.8125ZM2.625 14.8125V9.5625H4.125V14.8125H2.625ZM10.8525 15.12L5.625 13.6725V9.5625H6.8325L11.1975 11.19C11.4525 11.2875 11.625 11.535 11.625 11.8125C11.625 11.8125 10.1325 11.775 9.9 11.7L8.115 11.1075L7.6425 12.5325L9.4275 13.125C9.81 13.2525 10.2075 13.32 10.6125 13.32H14.625C14.9175 13.32 15.18 13.4925 15.3 13.74L10.8525 15.12Z"
              fill="#7B7B7B"
            />
          </svg>
        )}
      </div>
    </CopyToClipboard>
  );
};
