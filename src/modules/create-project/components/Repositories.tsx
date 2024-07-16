import { useCallback, useEffect, useState } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";

import { CustomInput } from "./CreateForm/components";

type Props = {
  onChange?: (repositories: string[]) => void;
};

const Repositories = ({ onChange }: Props) => {
  const repositories = useTypedSelector(
    (state) => state.createProject.githubRepositories,
  );

  const [repos, setRepos] = useState(
    repositories.length > 0 ? repositories : [""],
  );

  useEffect(() => {
    setRepos(repositories);
  }, [repositories]);

  const onChangeHandler = useCallback(
    (repoIndex: number, value: string) => {
      const updatedState = [...repositories];
      updatedState[repoIndex] = value;
      setRepos(updatedState);
      dispatch.createProject.updateRepositories(updatedState);
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
        <CustomInput
          key={repo}
          label=""
          prefix="github.com/"
          inputProps={{
            defaultValue: repo.replace("https://github.com/", ""),
            placeholder: "Enter repository address",
            onBlur: (e) => {
              onChangeHandler(
                index,
                e.target.value ? `https://github.com/${e.target.value}` : "",
              );
            },
          }}
        />
      ))}
    </>
  );
};

export default Repositories;
