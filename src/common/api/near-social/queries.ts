import { FeedsResult, IndexPostResultItem, PostContent } from "@/common/contracts/social/types";

import { nearSocialClient } from "./client";

export const fetchGlobalFeeds = async ({ accountIds, offset = 20 }: any) => {
  // First, use index to get the list of posts
  const indexResult = (await nearSocialClient.index({
    action: "post",
    key: "main",
    limit: offset.toString(),
    accountId: accountIds,
    order: "desc",
  })) as unknown as IndexPostResultItem[];

  // Fetch each post individually with its specific block height
  return await Promise.all(
    indexResult.map(async (item) => {
      const getResult = (await nearSocialClient.get({
        keys: [`${item.accountId}/post/main`],
        blockHeight: item.blockHeight,
      })) as FeedsResult;

      const postContent = getResult[item.accountId]?.post?.main;
      let parsedContent: PostContent;
      try {
        parsedContent = JSON.parse(postContent);
      } catch (e) {
        console.error("Error parsing post content:", e);
        parsedContent = { text: "Error: Could not parse post content" };
      }

      return {
        accountId: item.accountId,
        blockHeight: item.blockHeight,
        content: parsedContent.text || "No content available",
      };
    }),
  );
};

export const fetchAccountFeedPosts = async ({ accountId, offset = 20 }: any) => {
  // First, use index to get the list of posts
  const indexResult = (await nearSocialClient.index({
    action: "post",
    key: "main",
    limit: offset.toString(),
    accountId,
    order: "desc",
  })) as unknown as IndexPostResultItem[];

  // Fetch each post individually with its specific block height
  return await Promise.all(
    indexResult.map(async (item) => {
      const getResult = (await nearSocialClient.get({
        keys: [`${accountId}/post/main`],
        blockHeight: item.blockHeight,
      })) as FeedsResult;

      const postContent = getResult[accountId]?.post?.main;
      let parsedContent: PostContent;
      try {
        parsedContent = JSON.parse(postContent);
      } catch (e) {
        console.error("Error parsing post content:", e);
        parsedContent = { text: "Error: Could not parse post content" };
      }

      return {
        accountId: accountId,
        blockHeight: item.blockHeight,
        content: parsedContent.text || "No content available",
      };
    }),
  );
};

export const fetchSinglePost = async ({
  accountId,
  blockHeight,
}: {
  accountId: string;
  blockHeight: number | bigint;
}): Promise<{ accountId: string; blockHeight: number; content: string }> => {
  try {
    // Fetch the post using the accountId and blockHeight
    const getResult = (await nearSocialClient.get({
      keys: [`${accountId}/post/main`],
      blockHeight: blockHeight as bigint,
    })) as FeedsResult;

    const postContent = getResult[accountId]?.post?.main;
    let parsedContent: PostContent;

    try {
      parsedContent = JSON.parse(postContent);
    } catch (e) {
      console.error("Error parsing post content:", e);
      parsedContent = { text: "Error: Could not parse post content" };
    }

    return {
      accountId: accountId,
      blockHeight: Number(blockHeight),
      content: parsedContent.text || "No content available",
    };
  } catch (error) {
    console.error("Error fetching single post:", error);
    throw new Error("Could not fetch the post");
  }
};

export const fetchTimeByBlockHeight = async (blockHeight: number): Promise<string> => {
  if (!blockHeight) {
    return "unknown";
  }

  try {
    const res = await fetch(`https://api.near.social/time?blockHeight=${blockHeight}`);
    if (!res.ok || res.status !== 200) {
      return "unknown";
    }

    const timeMs = parseFloat(await res.text());
    const date = new Date(timeMs);
    const dateNow = new Date();

    const timeAgo = (diffSec: number) =>
      diffSec < 60000
        ? `${(diffSec / 1000) | 0}s`
        : diffSec < 3600000
          ? `${(diffSec / 60000) | 0}m`
          : diffSec < 86400000
            ? `${(diffSec / 3600000) | 0}h`
            : date.getFullYear() === dateNow.getFullYear()
              ? date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

    return timeAgo(dateNow.getTime() - timeMs);
  } catch (error) {
    console.error("Error fetching time:", error);
    return "unknown";
  }
};
