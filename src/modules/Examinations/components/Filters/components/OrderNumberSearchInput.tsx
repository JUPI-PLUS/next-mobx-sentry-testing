// libs
import React, { ChangeEvent, FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";

// components
import { SampleFilters } from "../../../models";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import FormMaskedRegExpInput from "../../../../../components/uiKit/forms/Inputs/MaskedInputs/RegExpMaskedNumberInput/FormMaskedRegExpInput";
import { ORDER_NUMBER_REG_EXP_MASK } from "./constants";

const OrderNumberSearchInput: FC<{ onFieldChange: (name: keyof SampleFilters, value: string) => void }> = ({
    onFieldChange,
}) => {
    const {
        trigger,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = useFormContext();

    const inputValue: string = watch("exam_order_number");

    const onFilterChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const result = await trigger("exam_order_number");
        if (result) {
            onFieldChange("exam_order_number", event.target.value);
        }
    };
    const onFilterReset = () => {
        setValue("exam_order_number", "");
        onFieldChange("exam_order_number", "");
        clearErrors("exam_order_number");
    };

    const hasValue = Boolean(inputValue.length);
    const hasError = Boolean(errors.exam_order_number);

    const inputClassName = useMemo(() => {
        if (hasError) {
            return "outline-red-100 outline outline-2 outline-offset-0 border-transparent";
        }

        if (hasValue) {
            return "outline-brand-200 outline outline-2 outline-offset-0 border-transparent";
        }

        return "";
    }, [hasError, hasValue]);

    return (
        <FormMaskedRegExpInput
            name="exam_order_number"
            placeholder="Order"
            mask={ORDER_NUMBER_REG_EXP_MASK}
            onChange={onFilterChange}
            isFilter
            inputClassName={inputClassName}
            endIcon={
                inputValue ? (
                    <XMarkIcon
                        data-testid="reset-icon"
                        className={`w-5 h-5 cursor-pointer ${hasValue && "fill-dark-900"}`}
                        onClick={onFilterReset}
                    />
                ) : (
                    <MagnifyingGlassIcon data-testid="search-icon" className="w-5 h-5 cursor-pointer" />
                )
            }
        />
    );
};
export default OrderNumberSearchInput;
