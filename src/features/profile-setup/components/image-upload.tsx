import { useState } from "react";

import Files from "react-files";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { nearSocialIpfsImageUpload } from "@/common/services/ipfs";
import { Button, Spinner } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import CameraIcon from "@/common/ui/svg/CameraIcon";
import { cn } from "@/common/ui/utils";

import type { ProfileSetupInputs } from "../models/types";

type Status = "ready" | "loading";

const useStatus = (initialStatus: Status = "ready") => {
  const [current, set] = useState(initialStatus);

  return { current, set };
};

export type ProfileSetupImageUploadProps = Pick<
  ProfileSetupInputs,
  "backgroundImage" | "profileImage"
> & {
  onBackgroundImageUploaded: (url: string) => void;
  onProfileImageUploaded: (url: string) => void;
};

export const ProfileSetupImageUpload: React.FC<ProfileSetupImageUploadProps> = ({
  backgroundImage,
  profileImage,
  onBackgroundImageUploaded,
  onProfileImageUploaded,
}) => {
  const { toast } = useToast();
  const bgImageStatus = useStatus();
  const profileImageStatus = useStatus();

  const onBgImageChange = async (files?: File[]) => {
    if (files) {
      bgImageStatus.set("loading");

      nearSocialIpfsImageUpload(files)
        .then((url) => {
          if (url !== undefined) {
            onBackgroundImageUploaded(url);
            toast({ title: "Background image successfully uploaded" });
          }
        })
        .catch((error) => {
          console.log(error);
          toast({ title: "Image upload error", description: error });
        })
        .finally(() => bgImageStatus.set("ready"));
    }
  };

  const onAvatarImageChange = async (files?: File[]) => {
    if (files) {
      nearSocialIpfsImageUpload(files)
        .then((url) => {
          if (url !== undefined) {
            onProfileImageUploaded(url);
            toast({ title: "Profile image successfully uploaded" });
          }
        })
        .catch((error) => {
          console.log(error);
          toast({ title: "Image upload error", description: error });
        })
        .finally(() => profileImageStatus.set("ready"));
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {/* BackgroundImage */}
      <div className="relative flex h-[280px] w-full rounded-[6px] bg-neutral-200">
        {backgroundImage && (
          <LazyLoadImage
            alt="Profile Background"
            src={backgroundImage}
            className="h-full w-full object-cover"
          />
        )}
        <Button
          type="button"
          variant="standard-outline"
          disabled={bgImageStatus.current === "loading"}
          className={cn(
            "absolute bottom-[1.5rem] right-[1.5rem]",
            "max-md:h-[40px] max-md:w-[40px] max-md:rounded-[50%] max-md:p-0",
          )}
        >
          <CameraIcon width={18} />
          {bgImageStatus.current === "ready" ? (
            <p className="font-500 text-[14px] max-md:hidden">Add cover photo</p>
          ) : (
            <Spinner width={18} height={18} />
          )}
          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            className="z-1 absolute top-0 h-full w-full"
            clickable
            onChange={onBgImageChange}
          />
        </Button>
      </div>

      {/* Profile Image */}
      <div
        className="relative h-[120px] w-[120px] rounded-full"
        style={{
          transform: "translateY(-37%)",
          boxShadow: "0px 0px 0px 3px #fff, 0px 0px 0px 1px rgba(199, 199, 199, 0.22) inset",
        }}
      >
        {profileImage && (
          <LazyLoadImage
            alt="Profile Image"
            src={profileImage}
            className="h-full w-full rounded-[50%] object-cover"
          />
        )}
        <Button
          type="button"
          variant="standard-outline"
          disabled={profileImageStatus.current === "loading"}
          className={
            "b-none absolute bottom-0 right-0 flex h-[40px] w-[40px] items-center rounded-[50%] p-0"
          }
          style={{
            boxShadow:
              "0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, 0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset, 0px 1px 2px -0.5px rgba(5, 5, 5, 0.08)",
          }}
        >
          {profileImageStatus.current === "ready" ? (
            <CameraIcon width={18} />
          ) : (
            <Spinner width={18} height={18} />
          )}

          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            className="z-1 absolute left-0 top-0 h-full w-full"
            clickable
            onChange={onAvatarImageChange}
          />
        </Button>
      </div>
    </div>
  );
};
