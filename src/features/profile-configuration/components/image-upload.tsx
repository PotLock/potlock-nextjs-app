import { useCallback } from "react";

import Files from "react-files";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { type FileUploadResult, pinataHooks } from "@/common/services/pinata";
import { Button, Spinner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";

import type { ProfileConfigurationInputs } from "../models/types";

export type ProfileConfigurationImageUploadProps = Pick<
  ProfileConfigurationInputs,
  "backgroundImage" | "profileImage"
> & {
  onBackgroundImageUploaded: (url: string) => void;
  onProfileImageUploaded: (url: string) => void;
};

export const ProfileConfigurationImageUpload: React.FC<ProfileConfigurationImageUploadProps> = ({
  backgroundImage,
  profileImage,
  onBackgroundImageUploaded,
  onProfileImageUploaded,
}) => {
  const { toast } = useToast();

  const onAvatarUploadSuccess = useCallback(
    (result: FileUploadResult) => {
      toast({ title: "Profile image successfully uploaded" });
      onProfileImageUploaded(result.url);
    },

    [onProfileImageUploaded, toast],
  );

  const { handleFileBufferChange: handleAvatarFileBufferChange, isPending: isAvatarUploadPending } =
    pinataHooks.useFileUpload({ onSuccess: onAvatarUploadSuccess });

  const onCoverUploadSuccess = useCallback(
    (result: FileUploadResult) => {
      toast({ title: "Background image successfully uploaded" });
      onBackgroundImageUploaded(result.url);
    },

    [onBackgroundImageUploaded, toast],
  );

  const { handleFileBufferChange: handleCoverFileBufferChange, isPending: isCoverUploadPending } =
    pinataHooks.useFileUpload({ onSuccess: onCoverUploadSuccess });

  return (
    <div className="flex flex-col items-center">
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
          disabled={isCoverUploadPending}
          className={cn(
            "absolute bottom-[1.5rem] right-[1.5rem]",
            "max-md:h-[40px] max-md:w-[40px] max-md:rounded-[50%] max-md:p-0",
          )}
        >
          <MdOutlineAddAPhoto className="color-neutral-500 w-4.5 h-4.5" />

          {isCoverUploadPending ? (
            <Spinner className="w-4.5 h-4.5" />
          ) : (
            <p className="font-500 text-[14px] max-md:hidden">{"Add cover photo"}</p>
          )}

          <Files
            clickable
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            onChange={handleCoverFileBufferChange}
            className="z-1 absolute top-0 h-full w-full"
          />
        </Button>
      </div>

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
          disabled={isAvatarUploadPending}
          className={
            "b-none absolute bottom-0 right-0 flex h-[40px] w-[40px] items-center rounded-[50%] p-0"
          }
          style={{
            boxShadow:
              "0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, " +
              "0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset, " +
              "0px 1px 2px -0.5px rgba(5, 5, 5, 0.08)",
          }}
        >
          {isAvatarUploadPending ? (
            <Spinner className="w-4.5 h-4.5" />
          ) : (
            <MdOutlineAddAPhoto className="color-neutral-500 w-4.5 h-4.5" />
          )}

          <Files
            clickable
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            onChange={handleAvatarFileBufferChange}
            className="z-1 absolute left-0 top-0 h-full w-full"
          />
        </Button>
      </div>
    </div>
  );
};
