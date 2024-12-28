import { useCallback, useState } from "react";

import { extractFromUrl } from "@/common/lib";
import { ACCOUNT_PROFILE_URL_PATTERNS } from "@/entities/account";
import { dispatch, useGlobalStoreSelector } from "@/store";

import { CustomInput } from "./components";

const SocialLinks = () => {
  const twitter = useGlobalStoreSelector((state) => state.projectEditor.twitter);
  const telegram = useGlobalStoreSelector((state) => state.projectEditor.telegram);
  const github = useGlobalStoreSelector((state) => state.projectEditor.github);
  const website = useGlobalStoreSelector((state) => state.projectEditor.website);

  const [twitterValue, setTwitterValue] = useState<string>(
    twitter?.replace("https://x.com/", "") || "",
  );

  const [telegramValue, setTelegramValue] = useState<string>(
    telegram?.replace("https://t.me/", "") || "",
  );

  const [githubValue, setGithubValue] = useState<string>(
    github?.replace("https://github.com/", "") || "",
  );

  const [websiteValue, setWebsiteValue] = useState<string>(website?.replace("https://", "") || "");

  const onChangeHandler = useCallback((socialKey: string, value: string) => {
    dispatch.projectEditor.updateSocialLinks({ [socialKey]: value });
  }, []);

  return (
    <>
      <CustomInput
        label="Twitter / X"
        prefix="x.com/"
        prefixMinWidth={110}
        inputProps={{
          value: twitterValue.replace("https://x.com/", ""),
          placeholder: "",
          onChange: (e) =>
            setTwitterValue(
              extractFromUrl(e.target.value, ACCOUNT_PROFILE_URL_PATTERNS.twitter) || "",
            ),
          onBlur: (_) => {
            onChangeHandler("twitter", twitterValue ? `https://x.com/${twitterValue}` : "");
          },
        }}
      />

      <CustomInput
        label="Telegram"
        prefix="t.me/"
        prefixMinWidth={110}
        inputProps={{
          value: telegramValue.replace("https://t.me/", ""),
          placeholder: "",
          onChange: (e) =>
            setTelegramValue(
              extractFromUrl(e.target.value, ACCOUNT_PROFILE_URL_PATTERNS.telegram) || "",
            ),
          onBlur: (_) => {
            onChangeHandler("telegram", telegramValue ? `https://t.me/${telegramValue}` : "");
          },
        }}
      />

      <CustomInput
        label="Github"
        prefix="github.com/"
        prefixMinWidth={110}
        inputProps={{
          value: githubValue.replace("https://github.com/", ""),
          placeholder: "",
          onChange: (e) =>
            setGithubValue(
              extractFromUrl(e.target.value, ACCOUNT_PROFILE_URL_PATTERNS.github) || "",
            ),
          onBlur: (_) => {
            onChangeHandler("github", githubValue ? `https://github.com/${githubValue}` : "");
          },
        }}
      />

      <CustomInput
        label="Website"
        prefix="https://"
        prefixMinWidth={110}
        inputProps={{
          value: websiteValue.replace("https://", ""),
          placeholder: "",
          onChange: (e) =>
            setWebsiteValue(
              extractFromUrl(e.target.value, ACCOUNT_PROFILE_URL_PATTERNS.website) || "",
            ),
          onBlur: (_) => {
            onChangeHandler("website", websiteValue ? `https://${websiteValue}` : "");
          },
        }}
      />
    </>
  );
};

export default SocialLinks;
