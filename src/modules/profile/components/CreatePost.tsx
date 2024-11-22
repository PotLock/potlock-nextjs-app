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
        <div>
            <form onSubmit={handleCreatePost}>
                <div
                    style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                    className=""
                >
                    <Textarea
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="What is happening?"
                        rows={3}
                    />
                </div>
                <div className="mt-4 flex flex-row-reverse">
                    <Button>Post</Button>
                </div>
            </form>
        </div>
    );
};
