// libs
import { DefaultValues } from "react-hook-form";

export interface FilterFormValuesUpdaterProps<T> {
    children: JSX.Element;
    defaultValues: DefaultValues<T>;
}
