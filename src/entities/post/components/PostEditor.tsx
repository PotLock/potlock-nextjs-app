import { useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { socialDbContractClient } from "@/common/contracts/social-db";
import { AccountId } from "@/common/types";
import { Button, Textarea } from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { useAccountSocialProfile } from "@/entities/_shared/account";

export const PostEditor = ({ accountId }: { accountId: AccountId }) => {
  const viewer = useWalletUserSession();

  const { avatar } = useAccountSocialProfile({
    enabled: viewer.isSignedIn,
    accountId: viewer.accountId as AccountId,
  });

  const [postText, setPostText] = useState("");

  const handleCreatePost = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    void socialDbContractClient
      .createPost({
        accountId,
        content: { text: postText, type: "md" },
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="py-4">
      <form onSubmit={handleCreatePost}>
        <div className="flex items-start gap-2 rounded-2xl border-none p-6 shadow-lg">
          <LazyLoadImage
            alt="Your avatar"
            src={avatar.url}
            width={50}
            height={50}
            className=" mx-1 h-8 w-8 rounded-[50%]"
          />
          <Textarea
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What is happening?"
            className="rounded-2xl border-0 focus:outline-none focus:ring-0"
            rows={5}
          />
        </div>
        <div className="mt-4 flex flex-row-reverse">
          <Button disabled={postText.length < 5}>Post</Button>
        </div>
      </form>
    </div>
  );
};
