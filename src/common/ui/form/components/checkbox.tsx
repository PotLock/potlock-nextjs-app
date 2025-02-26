import { Checkbox, FormControl, FormItem, FormLabel } from "../../layout/components";

export type CheckboxFieldProps = Pick<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "disabled" | "onCheckedChange"
> & { label?: React.ReactNode };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, ...props }) => {
  return (
    <FormItem className="flex-row items-center">
      <FormControl>
        <Checkbox {...props} />
      </FormControl>

      {label && (
        <FormLabel className="mt-0.5 flex flex-row items-center gap-2 font-normal">
          {label}
        </FormLabel>
      )}
    </FormItem>
  );
};
