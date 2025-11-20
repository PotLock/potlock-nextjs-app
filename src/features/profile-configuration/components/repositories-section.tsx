import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/common/ui/layout/components";

import { CustomInput } from "./editor-elements";
import type { ProfileConfigurationInputs } from "../models/types";

// Simple function to extract repository path from GitHub URL or direct input
const extractRepositoryPath = (input: string): string => {
  if (!input) return "";

  // Remove leading slash if present
  const cleanInput = input.startsWith("/") ? input.slice(1) : input;

  // If it's already a full GitHub URL, extract the path
  if (cleanInput.includes("github.com/")) {
    const githubIndex = cleanInput.indexOf("github.com/");
    return cleanInput.substring(githubIndex + 11).replace(/\/$/, "");
  }

  // Otherwise, return the input as-is (user is typing the repository path)
  return cleanInput;
};

const Repo = ({
  repo,
  index,
  onChangeHandler,
  onRemoveHandler,
}: {
  repo: string;
  index: number;
  onChangeHandler: (repoIndex: number, value: string) => void;
  onRemoveHandler: (repoIndex: number) => void;
}) => {
  // NOTE: this is a workaround to avoid the input value being reset to the original value when the user clicks on the input
  // Local state for the input value to avoid focus loss
  const [inputValue, setInputValue] = useState(repo?.replace("https://github.com/", "") || "");

  // Keep local state in sync if the prop changes externally
  useEffect(() => {
    setInputValue(repo?.replace("https://github.com/", "") || "");
  }, [repo]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    // Update the form with the canonical value when user finishes typing
    onChangeHandler(index, inputValue ? `https://github.com/${inputValue}` : "");
  }, [inputValue, index, onChangeHandler]);

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <CustomInput
          label=""
          prefix="github.com/"
          prefixMinWidth={110}
          inputProps={{
            value: inputValue,
            placeholder: "Enter repository address",
            onChange,
            onBlur,
          }}
        />
      </div>
      <Button variant="standard-outline" onClick={() => onRemoveHandler(index)} className="mb-2">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export type ProfileConfigurationRepositoriesSectionProps = {
  values: ProfileConfigurationInputs["githubRepositories"];
  onChange?: (repositories: string[]) => void;
  onUpdate?: (index: number, value: string) => void;
  onRemove?: (index: number) => void;
};

export const ProfileConfigurationRepositoriesSection: React.FC<
  ProfileConfigurationRepositoriesSectionProps
> = ({ values, onChange, onUpdate, onRemove }) => {
  const handleChange = useCallback(
    (index: number, value: string) => {
      if (onUpdate) {
        onUpdate(index, value);
      } else if (onChange && values) {
        const updatedRepos = [...values];
        updatedRepos[index] = value;
        onChange(updatedRepos);
      }
    },
    [onChange, onUpdate, values],
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (onRemove) {
        onRemove(index);
      } else if (onChange && values) {
        const updatedRepos = [...values];
        updatedRepos.splice(index, 1);
        onChange(updatedRepos);
      }
    },
    [onChange, onRemove, values],
  );

  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {values.map((repo, index) => (
        <Repo
          key={`${repo}-${index}`}
          repo={repo}
          index={index}
          onChangeHandler={handleChange}
          onRemoveHandler={handleRemove}
        />
      ))}
    </div>
  );
};
