import { useCallback } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";

import { CustomInput } from "./CreateForm/components";

const SocialLinks = () => {
  const twitter = useTypedSelector((state) => state.createProject.twitter);
  const telegram = useTypedSelector((state) => state.createProject.telegram);
  const github = useTypedSelector((state) => state.createProject.github);
  const website = useTypedSelector((state) => state.createProject.website);

  const onChangeHandler = useCallback((socialKey: string, value: string) => {
    dispatch.createProject.updateSocialLinks({ [socialKey]: value });
  }, []);

  return (
    <>
      <CustomInput
        label="Twitter / X"
        prefix="x.com/"
        inputProps={{
          defaultValue: twitter?.replace("https://x.com/", ""),
          placeholder: "",
          onBlur: (e) => {
            onChangeHandler(
              "twitter",
              e.target.value ? `https://x.com/${e.target.value}` : "",
            );
          },
        }}
      />

      <CustomInput
        label="Telegram"
        prefix="t.me/"
        inputProps={{
          defaultValue: telegram?.replace("https://t.me/", ""),
          placeholder: "",
          onBlur: (e) => {
            onChangeHandler(
              "telegram",
              e.target.value ? `https://t.me/${e.target.value}` : "",
            );
          },
        }}
      />

      <CustomInput
        label="Github"
        prefix="github.com/"
        inputProps={{
          defaultValue: github?.replace("https://github.com/", ""),
          placeholder: "",
          onBlur: (e) => {
            onChangeHandler(
              "github",
              e.target.value ? `https://github.com/${e.target.value}` : "",
            );
          },
        }}
      />

      <CustomInput
        label="Website"
        prefix="https://"
        inputProps={{
          defaultValue: website?.replace("https://", ""),
          placeholder: "",
          onBlur: (e) => {
            onChangeHandler(
              "website",
              e.target.value ? `https://${e.target.value}` : "",
            );
          },
        }}
      />
    </>
  );
};

export default SocialLinks;
