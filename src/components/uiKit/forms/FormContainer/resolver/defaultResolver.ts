import { FieldValues, ResolverResult } from "react-hook-form";
import { ObjectSchema, ValidationError } from "yup";
import { AssertsShape, ObjectShape } from "yup/lib/object";
import { deepTrim } from "../../../../../shared/utils/string";
import { formValidateErrorHandler } from "../utils";

export default <FormFields extends FieldValues>(
        schema?: ObjectSchema<ObjectShape>
    ): ((data: FormFields) => Promise<ResolverResult<FormFields>>) =>
    async data => {
        try {
            if (!schema) {
                return {
                    values: deepTrim(data) as FieldValues,
                    errors: {},
                } as ResolverResult<FormFields>;
            }
            const values: AssertsShape<ObjectShape> = await schema.validate(deepTrim(data), {
                abortEarly: false,
            });
            return {
                values: deepTrim(values) as FieldValues,
                errors: {},
            } as ResolverResult<FormFields>;
        } catch (err: unknown) {
            return formValidateErrorHandler<FormFields>(err as ValidationError);
        }
    };
