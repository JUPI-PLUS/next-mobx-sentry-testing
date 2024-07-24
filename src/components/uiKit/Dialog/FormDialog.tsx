import React, { useEffect } from "react";
import { FormDialogProps } from "./models";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import DialogContainer from "./components/DialogContainer";
import DialogHeader from "./components/DialogHeader";
import FormDialogFooter from "./components/FormDialogFooter";
import DialogBackdrop from "./components/DialogBackdrop";
import defaultResolver from "../forms/FormContainer/resolver/defaultResolver";

const FormDialog = <FormFields extends FieldValues>({
    isOpen,
    schema,
    mode,
    defaultValues,
    containerClass,
    title,
    cancelText,
    submitText,
    cancelButtonVariant,
    submitButtonVariant,
    submitButtonClassName,
    cancelButtonClassName,
    children,
    couldCloseOnBackdrop,
    couldCloseOnEsc = false,
    resolver,
    onCancel,
    onClose,
    onSubmit,
}: FormDialogProps<FormFields>) => {
    const methods = useForm<FormFields>({
        resolver: resolver ?? defaultResolver(schema),
        mode,
        defaultValues,
    });

    useEffect(() => {
        if (!isOpen) {
            methods.reset();
            methods.clearErrors();
        }
    }, [isOpen]);

    const { handleSubmit } = methods;

    if (!isOpen) return null;

    return (
        <>
            <DialogContainer className={containerClass} onClose={onClose} couldCloseOnBackdrop={couldCloseOnBackdrop}>
                <DialogHeader title={title} onClose={onClose} couldCloseOnEsc={couldCloseOnEsc} />
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative flex-auto">{children}</div>
                        <FormDialogFooter
                            cancelText={cancelText}
                            submitText={submitText}
                            cancelButtonVariant={cancelButtonVariant}
                            submitButtonVariant={submitButtonVariant}
                            onCancel={onCancel}
                            cancelButtonClassName={cancelButtonClassName}
                            submitButtonClassName={submitButtonClassName}
                        />
                    </form>
                </FormProvider>
            </DialogContainer>
            <DialogBackdrop />
        </>
    );
};

export default FormDialog;
