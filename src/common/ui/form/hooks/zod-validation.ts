import { useEffect } from "react";

import { type Path, type UseFormReturn, useWatch } from "react-hook-form";
import type { infer as FromSchema, ZodError, ZodSchema } from "zod";

export type FormCrossFieldZodValidationParams<TSchema extends ZodSchema> = {
  /**
   * The form instance returned by react-hook-form's useForm
   */
  form: UseFormReturn<FromSchema<TSchema>>;
  /**
   * A Zod schema that defines the validation rules including cross-field validations
   */
  schema: TSchema;
  /**
   * Array of field names that should be validated when other fields change
   */
  dependentFields: Array<keyof FromSchema<TSchema>>;

  injectedEffect?: (form: UseFormReturn<FromSchema<TSchema>>) => void;
};

/**
 * Performs complex form validation where the validity of one field depends on
 *  the state of other fields - a scenario not handled by react-hook-form's built-in validation.
 *
 * The hook watches for changes in form values and triggers Zod schema validation,
 *  setting errors on the specified target fields when validation fails.
 *
 * @param params - The parameters object. {@link FormCrossFieldZodValidationParams}
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   password: z.string(),
 *   passwordConfirmation: z.string()
 * }).refine(data => data.password === data.passwordConfirmation, {
 *   message: "Passwords don't match",
 *   path: ["passwordConfirmation"]
 * });
 *
 * const form = useForm<z.infer<typeof schema>>();
 *
 * useFormCrossFieldValidation({
 *   form,
 *   schema,
 *   dependentFields: ["passwordConfirmation"]
 * });
 * ```
 *
 * @returns void - This hook only produces side effects (setting form errors)
 */
export const useFormCrossFieldZodValidation = <TSchema extends ZodSchema>({
  form,
  schema,
  dependentFields,
  injectedEffect,
}: FormCrossFieldZodValidationParams<TSchema>) => {
  type Inputs = FromSchema<TSchema>;

  const values = useWatch({ control: form.control });

  useEffect(() => {
    injectedEffect?.(form);

    if (dependentFields.length > 0) {
      schema.parseAsync(values).catch((error?: ZodError) =>
        error?.issues.forEach(({ code, message, path }) => {
          const fieldPath = path.at(0);

          if (
            dependentFields.includes(fieldPath as keyof Inputs) &&
            typeof fieldPath === "string" &&
            code === "custom"
          ) {
            form.setError(fieldPath as Path<Inputs>, { message, type: code });
          }
        }),
      );
    }
  }, [schema, form, values, dependentFields, injectedEffect]);
};
