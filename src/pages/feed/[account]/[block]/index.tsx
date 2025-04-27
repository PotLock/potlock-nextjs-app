import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { fetchSinglePost, fetchTimeByBlockHeight } from "@/common/api/near-social-indexer";
import { IPFS_NEAR_SOCIAL_URL } from "@/common/constants";
import { AccountProfilePicture } from "@/entities/_shared/account";

export default function FeedAccountBlockPostPage() {
  const router = useRouter();
  const { account, block } = router.query;

  const [post, setPost] = useState<{
    accountId: string;
    blockHeight: number;
    content: string;
    imageIPFSHash?: string;
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
        .then((postData) => {
          setPost(postData);

          return fetchTimeByBlockHeight(Number(block));
        })
        .then(setTime)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [account, block]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  return (
    <div
      style={{ boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)" }}
      className="2xl-container px w-full rounded-2xl p-8 px-5 pb-12 md:px-10"
    >
      <div
        onClick={() => router.push(`/user/${post.accountId}`)}
        className="mb-4 flex items-center space-x-2"
      >
        <AccountProfilePicture accountId={post.accountId} className="h-8 w-8" />
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
          a: ({ node, ...props }) => {
            return (
              <a
                {...props}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          },
          img: (node) => (
            <div className="mt-4 flex w-full items-center justify-center">
              <img src={node.src} alt="" className="w-100 h-max object-contain" />
            </div>
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
      {post.imageIPFSHash && (
        <LazyLoadImage
          src={`${IPFS_NEAR_SOCIAL_URL}${post.imageIPFSHash}`}
          alt=""
          className="mt-2"
          width={700}
          height={700}
        />
      )}
    </div>
  );
}
