import { useState } from "react";

import Files from "react-files";

import { nearSocialIpfsImageUpload } from "@/common/services/ipfs";
import { Button, Spinner } from "@/common/ui/components";
import CameraIcon from "@/common/ui/svg/CameraIcon";

import type { ProfileSetupInputs } from "../models/types";

type Status = "ready" | "loading";

const useStatus = (initialStatus: Status = "ready") => {
  const [status, setStatus] = useState(initialStatus);

  return {
    status,
    setStatus,
  };
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
  const bgImageStatus = useStatus();
  const profileImageStatus = useStatus();

  const onBgImageChange = async (files?: File[]) => {
    if (files) {
      nearSocialIpfsImageUpload(files).then((url) => {
        if (url !== undefined) {
          onBackgroundImageUploaded(url);
        }
      });
    }
  };

  const onAvatarImageChange = async (files?: File[]) => {
    if (files) {
      nearSocialIpfsImageUpload(files).then((url) => {
        if (url !== undefined) {
          onProfileImageUploaded(url);
        }
      });
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {/* BackgroundImage */}
      <div className="relative flex h-[280px] w-full rounded-[6px] bg-neutral-200">
        {backgroundImage && (
          <img
            className="h-full w-full object-cover"
            src={backgroundImage}
            alt="Profile Background"
          />
        )}
        <Button
          className="absolute bottom-[1.5rem] right-[1.5rem] max-md:h-[40px] max-md:w-[40px] max-md:rounded-[50%] max-md:p-0"
          variant="standard-outline"
          disabled={bgImageStatus.status === "loading"}
        >
          <CameraIcon width={18} />
          {bgImageStatus.status === "ready" ? (
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
          <img
            className="h-full w-full rounded-[50%] object-cover"
            src={profileImage}
            alt="Profile Image"
          />
        )}
        <Button
          className="b-none absolute bottom-0 right-0 flex h-[40px] w-[40px] items-center rounded-[50%] p-0"
          variant="standard-outline"
          disabled={profileImageStatus.status === "loading"}
          style={{
            boxShadow:
              "0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, 0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset, 0px 1px 2px -0.5px rgba(5, 5, 5, 0.08)",
          }}
        >
          {profileImageStatus.status === "ready" ? (
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
