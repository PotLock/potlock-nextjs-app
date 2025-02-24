import { useEffect } from "react";

import { type Path, type UseFormReturn, useWatch } from "react-hook-form";
import type { infer as FromSchema, ZodError, ZodSchema } from "zod";

export type FormCrossFieldValidationParams<TSchema extends ZodSchema> = {
  form: UseFormReturn<FromSchema<TSchema>>;
  schema: TSchema;
  targetFields: Array<keyof FromSchema<TSchema>>;
};

export const useFormCrossFieldValidation = <TSchema extends ZodSchema>({
  form,
  schema,
  targetFields,
}: FormCrossFieldValidationParams<TSchema>) => {
  type Inputs = FromSchema<TSchema>;

  const values = useWatch({ control: form.control });

  useEffect(
    () =>
      void schema.parseAsync(values).catch((error: ZodError) =>
        error?.issues.forEach(({ code, message, path }) => {
          const fieldPath = path.at(0);

          if (
            targetFields.includes(fieldPath as keyof Inputs) &&
            typeof fieldPath === "string" &&
            code === "custom"
          ) {
            form.setError(fieldPath as Path<Inputs>, { message, type: code });
          }
        }),
      ),

    [schema, form, values, targetFields],
  );
};
