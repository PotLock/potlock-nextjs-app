import React, { useState } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import DotsIcons from "@/common/assets/svgs/DotsIcon";

const FeedCardOptionsSelect = ({ post }) => {
  const feedRoute = `${window.location.href}/${post.accountId}/${post.blockHeight}`;
  const [copyLinkText, setCopyLinkText] = useState("Copy Link");

  const handleCopyLink = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from bubbling up
    navigator.clipboard.writeText(feedRoute).then(() => {
      setCopyLinkText("Copied");
      setTimeout(() => {
        setCopyLinkText("Copy Link");
      }, 3000);
    });
  };

  const handleShareTweet = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from bubbling up
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(feedRoute)}`;
    window.open(tweetUrl, "_blank");
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="cursor-pointer rounded p-2 hover:bg-red-100">
          <DotsIcons />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="rounded border bg-white shadow-md">
        <DropdownMenu.Item
          onClick={handleCopyLink}
          className="cursor-pointer p-2 hover:bg-gray-200"
        >
          {copyLinkText}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={handleShareTweet}
          className="cursor-pointer p-2 hover:bg-gray-200"
        >
          Share Post as Tweet
        </DropdownMenu.Item>
        <DropdownMenu.Arrow className="fill-white" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FeedCardOptionsSelect;
