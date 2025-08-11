import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Markdown from "react-markdown";

import { PotApplicationStatus } from "@/common/api/indexer";
import { fetchTimeByBlockHeight } from "@/common/api/near-social-indexer";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";
import { potApplicationFiltersTags } from "@/features/pot-application";

import { PostActions } from "./PostActions";

export type PostCardProps = {
  isPot?: boolean;
  status?: PotApplicationStatus;

  post: {
    accountId: string;
    content: string;
    blockHeight: bigint;
    imageIPFSHash?: string;
  };
};

export const PostCard: React.FC<PostCardProps> = ({ post, isPot, status }) => {
  const router = useRouter();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      const time = await fetchTimeByBlockHeight(Number(post.blockHeight));
      setTime(time);
    };

    if (post.accountId) fetchProfileImage();
  }, [post.accountId, post.blockHeight]);

  const handleCardClick = useCallback(() => {
    router.push(`/feed/${post.accountId}/${post.blockHeight}`);
  }, [post.accountId, post.blockHeight, router]);

  const handleProfileClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      router.push(`/profile/${post.accountId}`);
    },
    [router, post.accountId],
  );

  return (
    <div
      onClick={handleCardClick}
      className={
        "group relative mb-4 cursor-pointer rounded-2xl border border-neutral-200 bg-background/80 p-5 shadow-sm transition-all duration-200 hover:bg-background hover:shadow-md md:w-full"
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            role="button"
            onClick={handleProfileClick}
            className="flex items-center gap-2 hover:underline"
          >
            <AccountProfilePicture accountId={post.accountId} className="h-8 w-8" />
            <AccountHandle
              accountId={post.accountId}
              maxLength={16}
              className="text-base font-semibold text-neutral-900"
            />
          </div>

          <div className="flex items-center">
            {time && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <p className="text-xs text-gray-500">{time}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center md:gap-2">
          {isPot && status && (
            <div
              style={{
                borderColor: potApplicationFiltersTags[status].borderColor,
                background: potApplicationFiltersTags[status].background,
                color: potApplicationFiltersTags[status].color,
              }}
              className="border-1 flex items-center gap-2 rounded-md px-2 py-1 text-[12px] md:px-3 md:py-1.5 md:text-sm"
            >
              {potApplicationFiltersTags[status].icon}
              {status}
            </div>
          )}
          <PostActions post={post} />
        </div>
      </div>

      <div className="mt-1 text-black">
        <Markdown
          className="prose prose-sm max-w-none break-words text-neutral-900 leading-relaxed"
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-600 underline hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            ),
            img: (node) => (
              <div className="mt-4 flex w-full items-center justify-center">
                <img src={node.src} alt="" className="w-100 h-max max-h-[420px] rounded-lg object-contain shadow-sm" />
              </div>
            ),
          }}
        >
          {post.content}
        </Markdown>
        {post?.imageIPFSHash && (
          <LazyLoadImage
            src={`${IPFS_NEAR_SOCIAL_URL}${post.imageIPFSHash}`}
            alt=""
            className="w-100 h-max max-h-[420px] rounded-lg object-contain shadow-sm"
            width={500}
            height={500}
          />
        )}
      </div>
    </div>
  );
};
