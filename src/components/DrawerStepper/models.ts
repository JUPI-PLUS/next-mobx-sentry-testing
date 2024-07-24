import { ObjectSchema } from "yup";
import { ObjectShape } from "yup/lib/object";
import { DefaultValues, FieldValues } from "react-hook-form";
import { FormDrawerProps } from "../uiKit/Drawer/models";

export interface DrawerStepProps<T> {
    backText: string;
    saveText: string;
    schema: ObjectSchema<ObjectShape>;
    defaultValues: Partial<DefaultValues<T>>;
}

export type DrawerStepperProps<T extends FieldValues> = Omit<
    FormDrawerProps<T>,
    "children" | "schema" | "defaultValues"
> & {
    disableOnCleanFields?: boolean;
    children: JSX.Element | JSX.Element[];
    steps: DrawerStepProps<T>[];
};
