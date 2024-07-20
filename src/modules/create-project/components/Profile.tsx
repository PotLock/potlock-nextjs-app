/* eslint-disable @next/next/no-img-element */

// https://www.npmjs.com/package/react-files
import Files from "react-files";

import CameraIcon from "@/common/assets/svgs/CameraIcon";
import { Button } from "@/common/ui/components";
import Spinner from "@/common/ui/components/Spinner";
import useStatus from "@/modules/core/hooks/usStatus";
import { dispatch, useTypedSelector } from "@/store";

const Profile = () => {
  const { accountId, backgroundImage, profileImage } = useTypedSelector(
    (state) => state.createProject,
  );

  const bgImageStatus = useStatus();
  const profileImageStatus = useStatus();

  if (!accountId) {
    return "";
  }

  const onBgImageChange = async (files: File[]) => {
    if (files) {
      bgImageStatus.setStatus("loading");
      await dispatch.createProject.uploadBackgroundImage(files);
      bgImageStatus.setStatus("ready");
    }
  };

  const onAvatarImageChange = async (files: File[]) => {
    if (files) {
      profileImageStatus.setStatus("loading");
      await dispatch.createProject.uploadProfileImage(files);
      profileImageStatus.setStatus("ready");
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
            <p className="font-500 text-[14px] max-md:hidden">
              Add cover photo
            </p>
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
          boxShadow:
            "0px 0px 0px 3px #fff, 0px 0px 0px 1px rgba(199, 199, 199, 0.22) inset",
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

export default Profile;
