import { useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { createPost } from "@/common/contracts/social";
import { authHooks } from "@/common/services/auth";
import { AccountId } from "@/common/types";
import { Button, Textarea } from "@/common/ui/components";
import { useAccountSocialProfile } from "@/entities/account";

export const CreatePost = ({ accountId }: { accountId: AccountId }) => {
  const authenticatedUser = authHooks.useUserSession();

  const { avatarSrc } = useAccountSocialProfile({
    enabled: authenticatedUser.isSignedIn,
    accountId: authenticatedUser.accountId ?? "noop",
  });

  const [postText, setPostText] = useState("");

  const handleCreatePost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await createPost({
        accountId,
        content: { text: postText, type: "md" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-4">
      <form onSubmit={handleCreatePost}>
        <div className="flex items-start gap-2 rounded-2xl border-none p-6 shadow-lg">
          <LazyLoadImage
            alt=""
            src={avatarSrc}
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
