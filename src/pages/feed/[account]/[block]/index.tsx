/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  fetchSinglePost,
  fetchTimeByBlockHeight,
} from "@/common/api/near-social";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { PROFILE_DEFAULTS } from "@/modules/profile/constants";

const SinglePost = () => {
  const [profileImg, setProfileImg] = useState<string>("");
  const router = useRouter();
  const { account, block } = useRouter().query;

  const [post, setPost] = useState<{
    accountId: string;
    blockHeight: number;
    content: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (account && block) {
      setIsLoading(true);

      fetchSinglePost({
        accountId: account as string,
        blockHeight: Number(block),
      })
        .then((fetchedPost) => {
          setPost(fetchedPost);
          // Fetch the profile image
          return fetchSocialImages({
            accountId: account as string,
          });
        })
        .then(({ image }) => {
          const timePromise = fetchTimeByBlockHeight(Number(block));
          return Promise.all([timePromise, image]);
        })
        .then(([time, image]) => {
          setTime(time);
          setProfileImg(image);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [account, block]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  return (
    <div className="w-full max-w-[1300px] p-8">
      <div
        onClick={() => router.push(`/user/${post.accountId}`)}
        className="mb-4 flex items-center space-x-2"
      >
        <Image
          src={profileImg || PROFILE_DEFAULTS.socialImages.image} // Fallback to default image if not found
          width={32}
          height={32}
          className="rounded-full shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]"
          alt="profile-image"
          onError={() => setProfileImg(PROFILE_DEFAULTS.socialImages.image)} // Handle image error
        />
        <h1 className="font-bold text-black">{post.accountId}</h1>
        <div className="flex items-center">
          {time && (
            <>
              <span className="mx-2 text-gray-500">•</span> {/* Centered dot */}
              <p className="text-sm text-gray-500"> {time}</p>
            </>
          )}
        </div>
      </div>
      <p className="mb-4 font-bold">Block Height: {post.blockHeight}</p>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          img: ({ node, ...props }) => (
            <div className="mt-4 flex w-full items-center justify-center">
              <img {...props} alt="image" width={500} height={300} />
            </div>
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
};
export default SinglePost;
