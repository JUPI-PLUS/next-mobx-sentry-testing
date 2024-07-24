import { FieldValues } from "react-hook-form";
import { ResolverRequired, SchemaRequired } from "../../../../shared/models/form";

export type FormContainerProps<T extends FieldValues> = (SchemaRequired<T> | ResolverRequired<T>) & {
    children: JSX.Element | JSX.Element[];
    beforeLeaveConfirmation?: () => void;
    toObserveFormValue?: unknown;
    confirmationDialogTitle?: string;
    confirmationDialogText?: string;
    className?: string;
};
