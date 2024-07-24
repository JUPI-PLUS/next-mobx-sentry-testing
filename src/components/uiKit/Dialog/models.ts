import React from "react";
import { ButtonVariant } from "../Button/models";
import { FieldValues } from "react-hook-form";
import { ResolverRequired, SchemaRequired } from "../../../shared/models/form";

export interface DialogProps {
    isOpen: boolean;
    title?: string;
    children?: JSX.Element | React.ReactFragment;
    cancelText?: string;
    submitText?: string;
    cancelButtonVariant?: ButtonVariant;
    isCancelButtonDisabled?: boolean;
    submitButtonVariant?: ButtonVariant;
    isSubmitButtonDisabled?: boolean;
    submitButtonClassName?: string;
    cancelButtonClassName?: string;
    containerClass?: string;
    childContainerClass?: string;
    couldCloseOnBackdrop?: boolean;
    couldCloseOnEsc?: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onSubmit: () => void;
}

export interface DialogContainerProps extends Pick<DialogProps, "onClose" | "couldCloseOnBackdrop"> {
    className?: string;
    children: JSX.Element | JSX.Element[];
}

export type DialogFooterProps = Omit<DialogProps, "isOpen" | "title" | "children" | "containerClass" | "onClose">;

export type FormDialogProps<FormFields extends FieldValues> = Omit<DialogProps, "onSubmit"> &
    (SchemaRequired<FormFields> | ResolverRequired<FormFields>);

export type FormDialogFooterProps = Omit<DialogFooterProps, "onSubmit">;
