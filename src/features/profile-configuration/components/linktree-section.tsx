import type { UseFormReturn } from "react-hook-form";

import { TextField } from "@/common/ui/form/components";
import { FormField } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import type { ProfileConfigurationInputs } from "../models/types";

const FieldInputExtension: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={cn(
      "color-neutral-600 w-30 flex h-full items-center px-4",
      "rounded-s-md bg-neutral-50 text-center",
    )}
  >
    {children}
  </span>
);

export type ProfileConfigurationLinktreeSectionProps = {
  form: UseFormReturn<ProfileConfigurationInputs>;
};

export const ProfileConfigurationLinktreeSection: React.FC<
  ProfileConfigurationLinktreeSectionProps
> = ({ form }) => (
  <>
    <FormField
      control={form.control}
      name="twitter"
      render={({ field }) => (
        <TextField
          label="X (Formerly Twitter)"
          labelExtension={<></>}
          {...field}
          inputExtension={<FieldInputExtension>{"x.com/"}</FieldInputExtension>}
          type="text"
          placeholder="x_handle"
          classNames={{ inputExtension: "h-full" }}
        />
      )}
    />

    <FormField
      control={form.control}
      name="telegram"
      render={({ field }) => (
        <TextField
          label="Telegram"
          labelExtension={<></>}
          {...field}
          inputExtension={<FieldInputExtension>{"t.me/"}</FieldInputExtension>}
          type="text"
          placeholder="telegram_handle"
          classNames={{ inputExtension: "h-full" }}
        />
      )}
    />

    <FormField
      control={form.control}
      name="github"
      render={({ field }) => (
        <TextField
          label="Github"
          labelExtension={<></>}
          {...field}
          inputExtension={<FieldInputExtension>{"github.com/"}</FieldInputExtension>}
          type="text"
          placeholder="github-username"
          classNames={{ inputExtension: "h-full" }}
        />
      )}
    />

    <FormField
      control={form.control}
      name="website"
      render={({ field }) => (
        <TextField
          label="Website"
          labelExtension={<></>}
          {...field}
          inputExtension={<FieldInputExtension>{"https://"}</FieldInputExtension>}
          type="text"
          placeholder="example.com"
          classNames={{ inputExtension: "h-full" }}
        />
      )}
    />
  </>
);
