// libs
import React, { useMemo, useRef } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";

// models
import { FormContainerProps } from "./models";

// hooks
import { useBeforeLeaveConfirmation } from "../../../../shared/hooks/useBeforeLeaveConfirmation/useBeforeLeaveConfirmation";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { useInitFormContainer } from "./hooks/useInitFormContainer";
import { useBeforeLeaveDialogActions } from "./hooks/useBeforeLeaveDialogActions";

//helpers
import defaultResolver from "./resolver/defaultResolver";
import { areDirtyFieldsEmpty } from "./utils";

// components
import Dialog from "../../Dialog/Dialog";

// constants
import { DEFAULT_CONFIRMATION_DIALOG_TEXT, DEFAULT_CONFIRMATION_DIALOG_TITLE } from "./constants";

const FormContainer = <T extends FieldValues>({
    mode = "onSubmit",
    children,
    schema, // or resolver is required
    defaultValues,
    shouldShowConfirmationDialog = true,
    className = "",
    resolver, // or schema is required
    onSubmit,
    beforeLeaveConfirmation,
    autoComplete = "off",
    toObserveFormValue, // any truth value always show dialog
    confirmationDialogTitle = DEFAULT_CONFIRMATION_DIALOG_TITLE,
    confirmationDialogText = DEFAULT_CONFIRMATION_DIALOG_TEXT,
}: FormContainerProps<T>) => {
    const methods = useForm<T>({
        resolver: resolver ?? defaultResolver(schema),
        mode,
        defaultValues,
    });
    const toObserveFormValueRef = useRef(toObserveFormValue);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isDirty } = methods.formState;

    const { onLeaveDialogSubmit, isLeaveCanceled, onRouteReverted, isConfirmed, isForceRedirect, cancelLeaveDialog } =
        useBeforeLeaveDialogActions({
            resetFormAction: methods.reset,
            toObserveFormValue: toObserveFormValueRef,
            beforeLeaveConfirmation,
            onCancelLeaveDialog: onClose,
        });

    const formStateBeforeLeave = useMemo(() => {
        if (isForceRedirect) return false;
        if (methods.formState.isSubmitSuccessful || methods.formState.isSubmitting) {
            return false;
        }

        if (Boolean(toObserveFormValueRef.current)) {
            // we can choose when to show dialog (like toObserve.field.name === text)
            return true;
        }

        if (!isEmpty(methods.formState.errors) || !areDirtyFieldsEmpty(methods.formState.dirtyFields)) {
            return true;
        }

        return false;
    }, [methods.formState]);

    const { leaveConfirmation } = useBeforeLeaveConfirmation(
        shouldShowConfirmationDialog && formStateBeforeLeave,
        onOpen,
        isConfirmed,
        isLeaveCanceled,
        onRouteReverted,
        onClose
    );

    useInitFormContainer({ isFormDirty: isDirty, shouldShowConfirmationDialog });

    const onSubmitDialog = () => {
        onLeaveDialogSubmit();
        leaveConfirmation();
    };

    const onCloseDialog = () => {
        onClose();
        cancelLeaveDialog();
    };

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={className} autoComplete={autoComplete}>
                {children}
            </form>
            <Dialog
                isOpen={isOpen}
                onClose={onCloseDialog}
                onSubmit={onSubmitDialog}
                title={confirmationDialogTitle}
                submitText="Confirm"
                cancelText="Cancel"
                onCancel={onCloseDialog}
            >
                <p>{confirmationDialogText}</p>
            </Dialog>
        </FormProvider>
    );
};

export default observer(FormContainer);
