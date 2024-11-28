import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Markdown from "react-markdown";

import { fetchTimeByBlockHeight } from "@/common/api/near-social";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";

import FeedCardOptionsSelect from "./FeedCardOptionsSelect";
import { PROFILE_DEFAULTS } from "../constants";

interface PostType {
  post: {
    accountId: string;
    content: string;
    blockHeight: bigint;
    imageIPFSHash?: string;
  };
}

export const FeedCard = ({ post }: PostType) => {
  const [profileImg, setProfileImg] = useState<string>("");
  const [time, setTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { image } = await fetchSocialImages({
        accountId: post.accountId,
      });
      const time = await fetchTimeByBlockHeight(Number(post.blockHeight));
      setTime(time);
      setProfileImg(image);
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
      className="md:w-100 md:w-full mb-4 cursor-pointer rounded-lg bg-white p-4 shadow-md transition duration-200 hover:bg-gray-100 hover:shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex">
          <div
            role="button"
            onClick={handleProfileClick}
            className="flex items-center space-x-2 hover:underline"
          >
            <Image
              src={profileImg}
              width={32}
              height={32}
              onError={() => {
                setProfileImg(PROFILE_DEFAULTS.socialImages.image);
              }}
              className="rounded-full shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]"
              alt="profile-image"
            />
            <p className="font-bold text-black ">{truncate(post.accountId, 10)}</p>
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
        <FeedCardOptionsSelect post={post} />
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
