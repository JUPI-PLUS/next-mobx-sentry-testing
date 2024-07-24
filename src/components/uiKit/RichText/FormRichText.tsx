import React, { FC, Suspense } from "react";
import { UnprivilegedEditor } from "react-quill";
import { Sources, DeltaStatic } from "quill";
import { useFormContext } from "react-hook-form";
import FieldError from "../forms/FieldError/FieldError";
import { FormRichTextProps } from "./models";
import dynamic from "next/dynamic";
import { CircularProgressLoader } from "../CircularProgressLoader/CircularProgressLoader";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";

const DynamicRichText = dynamic(() => import("./RichText"), {
    ssr: false,
    loading: () => <CircularProgressLoader />,
});

const FormRichText: FC<FormRichTextProps> = ({ name, onChange, errorMessage, ...rest }) => {
    const {
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitted },
    } = useFormContext();

    const onFieldChange = (fieldValue: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        if (onChange) {
            onChange(fieldValue, delta, source, editor);
        }
        setValue(name, fieldValue, { shouldDirty: true });
        if (isSubmitted && errors[name]) {
            trigger(name);
        }
    };

    const formValue = watch(name);

    // the variable received a value either from props, from formContext or just equals to ""
    const getErrorMessage = errorMessage ?? (errors[name]?.message as string) ?? "";

    return (
        <div>
            <ErrorBoundary>
                <Suspense fallback={<CircularProgressLoader />}>
                    <DynamicRichText onChange={onFieldChange} value={formValue} {...rest} />
                </Suspense>
            </ErrorBoundary>
            {getErrorMessage && <FieldError name={name} message={getErrorMessage} className="text-xs order-3 mt-1.5" />}
        </div>
    );
};

export default FormRichText;
