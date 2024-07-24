import React, { useEffect, useMemo } from "react";
import { FormDrawerProps } from "./models";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import DrawerContainer from "./components/DrawerContainer";
import FormDrawerFooter from "./components/FormDrawerFooter";
import DrawerBackdrop from "./components/DrawerBackdrop";
import defaultResolver from "../forms/FormContainer/resolver/defaultResolver";
import Dialog from "../Dialog/Dialog";
import useBeforeLeave from "./hooks/useBeforeLeave";
import FormDrawerHeader from "./components/headers/FormDrawerHeader";

const FormDrawerInner = <FormFields extends FieldValues>({
    isOpen,
    schema,
    mode,
    defaultValues,
    containerClass = "",
    childrenContainerClass = "",
    disableOnCleanFields = false,
    title,
    cancelText,
    submitText,
    optionalText,
    cancelButtonVariant,
    submitButtonVariant,
    submitButtonClassName,
    cancelButtonClassName,
    children,
    couldCloseOnBackdrop = true,
    couldCloseOnEsc = true,
    side = "left",
    size = "xs",
    resolver,
    isSubmitButtonDisabled,
    askBeforeLeave = true,
    isDirty = false,
    onCancel,
    onOptional,
    onSubmit,
    onClose,
    headerButton,
}: FormDrawerProps<FormFields>) => {
    const methods = useForm<FormFields>({
        resolver: resolver ?? defaultResolver<FormFields>(schema),
        mode,
        defaultValues,
    });

    const [isBeforeLeaveDialogOpen, onCloseDrawer, onConfirmLeave, onDiscardLeave] = useBeforeLeave({
        isDirty: methods.formState.isDirty || isDirty,
        onClose,
        askBeforeLeave,
    });

    useEffect(() => {
        if (!isOpen) {
            methods.reset();
        }
    }, [isOpen]);

    const { handleSubmit } = methods;

    const sizeClassName = useMemo(() => {
        switch (size) {
            case "md":
                return "max-w-md";
            case "lg":
                return "max-w-lg";
            case "xl":
                return "max-w-2/5";
            default:
                return "max-w-xs";
        }
    }, [size]);

    return (
        <>
            <DrawerContainer
                className={`${containerClass} ${sizeClassName} h-full w-full`}
                onClose={onCloseDrawer}
                side={side}
            >
                <FormProvider {...methods}>
                    <FormDrawerHeader
                        title={title}
                        onClose={onCloseDrawer}
                        couldCloseOnEsc={couldCloseOnEsc}
                        headerButton={headerButton}
                    />
                    <form className="flex flex-col h-full overflow-x-auto" onSubmit={handleSubmit(onSubmit)}>
                        <div
                            className={`relative flex-grow h-full flex-auto mb-5 overflow-x-auto p-6 ${childrenContainerClass}`}
                        >
                            {children}
                        </div>
                        <FormDrawerFooter
                            cancelText={cancelText}
                            submitText={submitText}
                            optionalText={optionalText}
                            cancelButtonVariant={cancelButtonVariant}
                            submitButtonVariant={submitButtonVariant}
                            onCancel={onCancel}
                            onOptional={onOptional}
                            cancelButtonClassName={cancelButtonClassName}
                            submitButtonClassName={submitButtonClassName}
                            disableOnCleanFields={disableOnCleanFields}
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                        />
                    </form>
                </FormProvider>
            </DrawerContainer>
            <DrawerBackdrop couldCloseOnBackdrop={couldCloseOnBackdrop} onClose={onCloseDrawer} />
            <Dialog
                onSubmit={onConfirmLeave}
                isOpen={isBeforeLeaveDialogOpen}
                onClose={onDiscardLeave}
                onCancel={onDiscardLeave}
                title="Do you want to leave?"
                submitText="Leave"
                cancelText="Stay"
            >
                <p>Changes you made may not be saved.</p>
            </Dialog>
        </>
    );
};

const FormDrawer = <FormFields extends FieldValues>({ isOpen, ...rest }: FormDrawerProps<FormFields>) => {
    if (!isOpen) return null;
    return <FormDrawerInner isOpen={isOpen} {...rest} />;
};

export default FormDrawer;
