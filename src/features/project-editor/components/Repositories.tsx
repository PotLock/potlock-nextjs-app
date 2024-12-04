import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { extractFromUrl, urlPatters } from "@/entities/core";
import { dispatch, useGlobalStoreSelector } from "@/store";

import { CustomInput } from "./components";

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
    setValue(extractFromUrl(e.target.value, urlPatters.github) || "");
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

type Props = {
  onChange?: (repositories: string[]) => void;
};

const Repositories = ({ onChange }: Props) => {
  const repositories = useGlobalStoreSelector(
    (state) => state.projectEditor.githubRepositories || [],
  );

  const [repos, setRepos] = useState(repositories.length > 0 ? repositories : [""]);

  useEffect(() => {
    setRepos(repositories);
  }, [repositories]);

  const onChangeHandler = useCallback(
    (repoIndex: number, value: string) => {
      const updatedState = [...repositories];
      updatedState[repoIndex] = value;
      setRepos(updatedState);
      dispatch.projectEditor.updateRepositories(updatedState);
    },
    [repositories],
  );

  useEffect(() => {
    if (onChange) {
      onChange(repos);
    }
  }, [repos, onChange]);

  const toShow = repositories.length > 0 ? repositories : [""];

  return (
    <>
      {toShow.map((repo, index) => (
        <Repo key={repo} repo={repo} index={index} onChangeHandler={onChangeHandler} />
      ))}
    </>
  );
};

export default Repositories;
