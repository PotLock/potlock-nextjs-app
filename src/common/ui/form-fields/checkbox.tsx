import { Checkbox } from "../components";
import { FormControl, FormItem, FormLabel } from "../components/form";

export type CheckboxFieldProps = Pick<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
> & { label: React.ReactNode };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  ...props
}) => {
  return (
    <FormItem className="flex flex-row items-center gap-2">
      <FormControl>
        <Checkbox {...props} />
      </FormControl>

      <FormLabel className="mt-0.5 flex flex-row items-center gap-2 font-normal">
        {label}
      </FormLabel>
    </FormItem>
  );
};
