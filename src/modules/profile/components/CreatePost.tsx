import { useState } from "react";

import { createPost } from "@/common/contracts/social";
import { AccountId } from "@/common/types";
import { Button, Textarea } from "@/common/ui/components";

export const CreatePost = ({ accountId }: { accountId: AccountId }) => {
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
        <div className="rounded-2xl border-none shadow-lg">
          <Textarea
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What is happening?"
            className="rounded-2xl border-none p-6 focus:border-none"
            rows={5}
          />
        </div>
        <div className="mt-4 flex flex-row-reverse">
          <Button>Post</Button>
        </div>
      </form>
    </div>
  );
};
