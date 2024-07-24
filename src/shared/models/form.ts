import { DefaultValues, SubmitHandler, FieldValues, ResolverResult } from "react-hook-form";
import { ObjectSchema } from "yup";
import { ObjectShape } from "yup/lib/object";
import { AxiosError } from "axios";
import { BaseFormServerValidation } from "./axios";
import { Resolver } from "react-hook-form";

export interface SchemaRequired<FormFields extends FieldValues> extends BaseFormContainerProps<FormFields> {
    schema: ObjectSchema<ObjectShape>;
    resolver?: Resolver<FormFields>;
}

export interface ResolverRequired<FormFields extends FieldValues> extends BaseFormContainerProps<FormFields> {
    schema?: ObjectSchema<ObjectShape>;
    resolver: Resolver<FormFields>;
}

export interface BaseFormContainerProps<FormFields extends FieldValues> {
    defaultValues: DefaultValues<FormFields>;
    shouldShowConfirmationDialog?: boolean;
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
    onSubmit: SubmitHandler<FormFields>;
    autoComplete?: "on" | "off";
}

export type CustomResolver<FormFields extends FieldValues> = () => (
    data: FormFields
) => Promise<ResolverResult<FieldValues>>;

export interface BaseFormValidationProps {
    id?: string;
    isError?: boolean;
    errors: AxiosError<BaseFormServerValidation> | null;
}

export interface Lookup<LookupT> {
    label: string;
    value: LookupT;
}

export interface CreatableLookup<LookupT> {
    label: string;
    value: LookupT;
    __isNew__?: boolean;
}

export type FormStatus = "idle" | "loading" | "error" | "success";
