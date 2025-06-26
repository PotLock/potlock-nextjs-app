import { ChangeEvent, useState } from "react";

import { ACCOUNT_PROFILE_URL_PATTERNS } from "@/entities/_shared/account";

import { CustomInput } from "./editor-elements";
import type { ProfileConfigurationInputs } from "../models/types";

const extractFromUrl = (url: string, pattern: RegExp) => {
  if (url) {
    if (url.startsWith("/")) {
      url = url.slice(1, url.length);
    }

    // Execute the regular expression on the URL
    const match = url.match(pattern);
    // If a match is found, return the extracted repository path; otherwise, return null
    return match ? match[1] : url;
  }
};

const Repo = ({
  repo,
  index,
  onChangeHandler,
}: {
  repo: string;
  index: number;
  onChangeHandler: (repoIndex: number, value: string) => void;
}) => {
  const [fieldValue, setValue] = useState<string>(repo?.replace("https://github.com/", "") || "");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(extractFromUrl(e.target.value, ACCOUNT_PROFILE_URL_PATTERNS.github) || "");
  };

  return (
    <CustomInput
      label=""
      prefix="github.com/"
      prefixMinWidth={110}
      inputProps={{
        value: fieldValue.replace("https://github.com/", ""),
        placeholder: "Enter repository address",
        onChange,
        onBlur: (_) => {
          onChangeHandler(index, fieldValue ? `https://github.com/${fieldValue}` : "");
        },
      }}
    />
  );
};

export type ProfileConfigurationRepositoriesSectionProps = {
  values: ProfileConfigurationInputs["githubRepositories"];
  onChange?: (repositories: string[]) => void;
};

export const ProfileConfigurationRepositoriesSection: React.FC<
  ProfileConfigurationRepositoriesSectionProps
> = ({ values, onChange }) => {
  // const [repos, setRepos] = useState(repositories.length > 0 ? repositories : [""]);

  // useEffect(() => {
  //   setRepos(repositories);
  // }, [repositories]);

  // const onChangeHandler = useCallback(
  //   (repoIndex: number, value: string) => {
  //     const updatedState = [...repositories];
  //     updatedState[repoIndex] = value;
  //     setRepos(updatedState);
  //     dispatch.projectEditor.updateRepositories(updatedState);
  //   },
  //   [repositories],
  // );

  // useEffect(() => {
  //   if (onChange) {
  //     onChange(repos);
  //   }
  // }, [repos, onChange]);

  return values?.map((repo, index) => (
    <Repo key={repo} repo={repo} index={index} onChangeHandler={() => {}} />
  ));
};
