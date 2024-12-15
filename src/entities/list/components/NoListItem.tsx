import { useEffect, useState } from "react";

import Image from "next/image";

import { Button } from "@/common/ui/components";

import { NoListItemType } from "../types";

export const NoListItem = ({
  type,
  showButton,
  route,
}: {
  type: NoListItemType;
  showButton: boolean;
  route?: () => void;
}) => {
  const [text, setText] = useState<string>();

  useEffect(() => {
    switch (type) {
      case NoListItemType.ACCOUNT:
        setText("There are no Accounts in this list yet");
        break;
      case NoListItemType.ALL_LISTS:
        setText(
          "No list? Create on chain lists of your favorite projects, and build your own discovery portal.",
        );

        break;
      case NoListItemType.FAVORITE_LISTS:
        setText(
          "Curate a personalized lists by upvoting your favorites and build your own discovery portal.",
        );

        break;
      case NoListItemType.NO_RESULTS:
        setText("No Results found");
        break;
      case NoListItemType.MY_LISTS:
        setText(
          "No list? Create on chain lists of your favorite projects, and build your own discovery portal.",
        );

        break;
    }
  }, [type]);

  return (
    <div className="min-h-100 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/icons/no-list.svg"
        alt=""
        width={200}
        height={200}
        className="mb-4 h-[200px] w-[200px]"
      />
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        <p className="w-100 font-lora text-center italic">{text}</p>
        {showButton && (
          <Button onClick={route} variant="standard-filled">
            {type === NoListItemType.FAVORITE_LISTS ? "Start Curating" : "Create List"}
          </Button>
        )}
      </div>
    </div>
  );
};
