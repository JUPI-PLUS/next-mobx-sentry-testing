import { ButtonVariant } from "../Button/models";
import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import { ResolverRequired, SchemaRequired } from "../../../shared/models/form";

export type DrawerSize = "xs" | "md" | "lg" | "xl";

export interface DrawerProps {
    isOpen: boolean;
    title?: string;
    children?: JSX.Element;
    cancelText?: string;
    submitText?: string;
    optionalText?: string;
    cancelButtonVariant?: ButtonVariant;
    submitButtonVariant?: ButtonVariant;
    submitButtonClassName?: string;
    cancelButtonClassName?: string;
    disableOnCleanFields?: boolean;
    containerClass?: string;
    childrenContainerClass?: string;
    couldCloseOnBackdrop?: boolean;
    couldCloseOnEsc?: boolean;
    side?: "right" | "left";
    size?: DrawerSize;
    headerButton?: ReactNode;
    isSubmitButtonDisabled?: boolean;
    askBeforeLeave?: boolean;
    isDirty?: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onOptional?: () => void;
    onSubmit?: () => void;
}

export interface DrawerContainerProps extends Pick<DrawerProps, "onClose" | "side"> {
    className?: string;
    children: ReactNode | ReactNode[];
}

export type DrawerBackdropProps = Pick<DrawerProps, "onClose" | "couldCloseOnBackdrop">;

export interface DrawerHeaderProps extends Pick<DrawerProps, "title" | "onClose" | "couldCloseOnEsc" | "headerButton"> {
    closeButtonDisabled?: boolean;
}

export type DrawerFooterProps = Omit<DrawerProps, "isOpen" | "title" | "children" | "containerClass" | "onClose">;

export type FormDrawerProps<FormFields extends FieldValues> = Omit<DrawerProps, "onSubmit"> &
    (SchemaRequired<FormFields> | ResolverRequired<FormFields>);

export type FormDrawerFooterProps = Omit<DrawerFooterProps, "onSubmit"> & {
    isSubmitButtonDisabled?: boolean;
    isOptionalButtonDisabled?: boolean;
    disableOnCleanFields?: boolean;
};
