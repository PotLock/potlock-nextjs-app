import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Markdown from "react-markdown";

import { PotApplicationStatus } from "@/common/api/indexer";
import { fetchTimeByBlockHeight } from "@/common/api/near-social";
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
        "md:w-100 bg-background mb-4 cursor-pointer rounded-lg p-4 shadow-md transition duration-200 hover:bg-gray-100 hover:shadow-lg md:w-full"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex">
          <div
            role="button"
            onClick={handleProfileClick}
            className="flex items-center space-x-2 hover:underline"
          >
            <AccountProfilePicture accountId={post.accountId} className="h-4 w-4" />
            <AccountHandle accountId={post.accountId} maxLength={16} className="text-neutral-950" />
          </div>

          <div className="flex items-center">
            {time && (
              <>
                <span className="mx-2 text-gray-500">•</span> {/* Centered dot */}
                <p className="text-sm text-gray-500"> {time}</p>
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
              className="border-1 flex items-center gap-2 rounded p-1 text-[13px] md:px-4 md:py-2 md:text-sm"
            >
              {potApplicationFiltersTags[status].icon}
              {status}
            </div>
          )}
          <PostActions post={post} />
        </div>
      </div>

      <div className="mt-2 text-black">
        <Markdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            ),
            img: (node) => (
              <div className="mt-4 flex w-full items-center justify-center">
                <img src={node.src} alt="" className="w-100 h-max object-contain" />
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
            className="w-100 h-max object-contain"
            width={500}
            height={500}
          />
        )}
      </div>
    </div>
  );
};
