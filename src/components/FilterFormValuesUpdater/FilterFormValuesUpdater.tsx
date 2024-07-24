// libs
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

// models
import { FilterFormValuesUpdaterProps } from "./models";

const FilterFormValuesUpdater = <T,>({ children, defaultValues }: FilterFormValuesUpdaterProps<T>) => {
    const { reset } = useFormContext();

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return children;
};

export default FilterFormValuesUpdater;
