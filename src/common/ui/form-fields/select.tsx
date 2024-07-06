import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components";

export const SelectFieldOption = SelectItem;

export type SelectFieldProps = Pick<
  React.ComponentProps<typeof Select>,
  "disabled" | "defaultValue" | "onValueChange" | "children"
> & {
  embedded?: boolean;
  label: string;
  placeholder?: string;
  description?: string;

  classes?: {
    root?: string;
    trigger?: string;
  };
};

export const SelectField: React.FC<SelectFieldProps> = ({
  embedded = false,
  label,
  placeholder,
  description,
  classes,
  children,
  ...props
}) => {
  const body = (
    <>
      <Select {...props}>
        <FormControl>
          <SelectTrigger className={classes?.trigger}>
            <SelectValue {...{ placeholder }} />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          <SelectGroup>
            {embedded && <SelectLabel>{label}</SelectLabel>}
            {children}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </>
  );

  return embedded ? (
    body
  ) : (
    <FormItem className={classes?.root}>
      <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
        <FormLabel>{label}</FormLabel>
      </div>

      {body}
    </FormItem>
  );
};
