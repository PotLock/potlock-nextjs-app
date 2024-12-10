import React, { useState } from "react";

import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

import { DotsIcons } from "@/common/assets/svgs";
import {
  ClipboardCopyButton,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/components";

interface Post {
  accountId: string;
  blockHeight: bigint;
}

interface FeedCardOptionsSelectProps {
  post: Post;
}

const FeedCardOptionsSelect: React.FC<FeedCardOptionsSelectProps> = ({ post }) => {
  const feedRoute = `${window.location.href}/${post.accountId}/${post.blockHeight}`;
  const [copyLinkText] = useState("Copy Link ");

  const handleShareTweet = (event: React.MouseEvent) => {
    event.stopPropagation();
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(feedRoute)}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer rounded p-2 hover:bg-red-100">
          <DotsIcons />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded border bg-white shadow-md">
        <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer space-x-2 p-2 hover:bg-gray-200"
        >
          {copyLinkText}
          <ClipboardCopyButton customIcon={<span></span>} text={feedRoute} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleShareTweet}
          className="cursor-pointer p-2 hover:bg-gray-200"
        >
          Share Post as Tweet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedCardOptionsSelect;
