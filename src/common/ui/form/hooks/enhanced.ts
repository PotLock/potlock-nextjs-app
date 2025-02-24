import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, type UseFormReturn, useForm } from "react-hook-form";
import { isDeepEqual, keys, pick } from "remeda";
import type { infer as FromSchema, ZodSchema } from "zod";

import {
  type FormCrossFieldZodValidationParams,
  useFormCrossFieldZodValidation,
} from "./zod-validation";

export type EnhancedFormProps<TSchema extends ZodSchema> = Omit<
  UseFormProps<FromSchema<TSchema>>,
  "resolver"
> &
  Pick<FormCrossFieldZodValidationParams<TSchema>, "dependentFields"> & {
    schema: TSchema;
  };

export type EnhancedFormBindings = {
  /**
   * Indicates whether the form is out of sync with the current defaultValues state.
   *
   * Useful when `defaultValues` is reactive and can potentially change.
   */
  isUnpopulated: boolean;
};

/**
 * Enhanced version of react-hook-form's useForm that includes cross-field validation
 * functionality and enforces Zod schema validation.
 *
 * @remarks
 * This hook combines the power of react-hook-form with Zod validation and adds support
 * for complex cross-field validation scenarios.
 *
 * @param props - form configuration and validation parameters. {@link EnhancedFormProps}
 *
 * @returns object - form with enhancements. {@link UseFormReturn} & {@link EnhancedFormBindings}
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   password: z.string().min(8),
 *   passwordConfirmation: z.string()
 * }).refine(data => data.password === data.passwordConfirmation, {
 *   message: "Passwords don't match",
 *   path: ["passwordConfirmation"]
 * });
 *
 * function App() {
 *   const form = useEnhancedForm({
 *     schema,
 *     dependentFields: ["passwordConfirmation"],
 *     defaultValues: {
 *       password: "",
 *       passwordConfirmation: ""
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <input {...form.register("password")} />
 *       <input {...form.register("passwordConfirmation")} />
 *       {form.formState.errors.passwordConfirmation && (
 *         <span>{form.formState.errors.passwordConfirmation.message}</span>
 *       )}
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useEnhancedForm = <TSchema extends ZodSchema>({
  schema,
  dependentFields,
  defaultValues,
  ...formProps
}: EnhancedFormProps<TSchema>): {
  form: UseFormReturn<FromSchema<TSchema>>;
} & EnhancedFormBindings => {
  const self = useForm<FromSchema<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
    defaultValues,
  });

  useFormCrossFieldZodValidation({ form: self, schema, dependentFields });

  const isUnpopulated =
    !isDeepEqual(
      defaultValues,
      pick(self.formState.defaultValues ?? {}, keys(defaultValues ?? {})),
    ) && !self.formState.isDirty;

  return { form: self, isUnpopulated };
};
