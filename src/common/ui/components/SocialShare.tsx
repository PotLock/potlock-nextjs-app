import {
  InstagramShareIcon,
  ShareIcon,
  TelegramShareIcon,
  TwitterShareIcon,
} from "@/common/assets/svgs/Share";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./atoms/button";
import CopyToClipboard from "react-copy-to-clipboard";
import { useCallback, useState } from "react";
import { CopyPasteIcon } from "@/common/assets/svgs";
import { Check } from "lucide-react";

export const SocialsShare = ({ shareContent }: { shareContent?: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const share = shareContent ?? window.location.href;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <ShareIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-max-[292px] flex h-[256px] flex-col items-center justify-center gap-4 ">
          <h1 className="font-bold">Share this with...</h1>
          <div className="flex w-full items-center justify-evenly">
            <button
              className="flex h-[48px] w-[48px] items-center justify-center rounded border border-[#DBDBDB] bg-[#F7F7F7]"
              onClick={() =>
                window.open(`https://t.me/share/url?url=${share}`, "_blank")
              }
              aria-label="Share on Telegram"
            >
              <TelegramShareIcon />
            </button>
            <button
              className="flex h-[48px] w-[48px] items-center justify-center rounded border border-[#DBDBDB] bg-[#F7F7F7]"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${share}&text=Check this out on Potlock @potlock_`,
                  "_blank",
                )
              }
              aria-label="Share on Twitter"
            >
              <TwitterShareIcon />
            </button>
            <button
              className="flex h-[48px] w-[48px] items-center justify-center rounded border border-[#DBDBDB] bg-[#F7F7F7]"
              onClick={() =>
                window.open(`https://www.instagram.com/?url=${share}`, "_blank")
              }
              aria-label="Share on Instagram"
            >
              <InstagramShareIcon />
            </button>
          </div>
          <div className="my-6 flex w-full items-center">
            <div className="h-px flex-grow bg-[#DBDBDB]" />
            <span className="mx-2">or</span>
            <div className="h-px flex-grow bg-[#DBDBDB]" />
          </div>
          <CopyToClipboard {...{ text: share, onCopy }}>
            <Button
              className="w-full hover:cursor-pointer"
              variant="standard-outline"
            >
              {copied ? (
                <Check color="#A6A6A6" size={20} className="" />
              ) : (
                <CopyPasteIcon />
              )}{" "}
              Copy Link
            </Button>
          </CopyToClipboard>
        </div>
      </PopoverContent>
    </Popover>
  );
};
