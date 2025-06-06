import React, { useState } from "react";

import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

import {
  ClipboardCopyButton,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/layout/components";
import { DotsIcons } from "@/common/ui/layout/svg";

interface Post {
  accountId: string;
  blockHeight: bigint;
}

export interface PostActionsProps {
  post: Post;
}

export const PostActions: React.FC<PostActionsProps> = ({ post }) => {
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
      <DropdownMenuContent className="bg-background rounded border shadow-md">
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
