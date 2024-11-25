/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { fetchTimeByBlockHeight } from "@/common/api/near-social";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";

import FeedCardOptionsSelect from "./FeedCardOptionsSelect";
import { PROFILE_DEFAULTS } from "../constants";

interface PostType {
  post: {
    accountId: string;
    content: string;
    blockHeight: bigint;
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
  }, [post.accountId]);

  const handleCardClick = useCallback(() => {
    router.push(`/feed/${post.accountId}/${post.blockHeight}`);
  }, [post]);

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
            className="  flex items-center space-x-2 hover:underline"
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
            <p className="font-bold text-black ">{truncate(post.accountId, 20)}</p>
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
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent the click from bubbling up
                }}
              />
            ),
            img: (node) => (
              <div className="mt-4 flex w-full items-center justify-center">
                <img src={node.src} alt="" width={500} height={300} />
              </div>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
