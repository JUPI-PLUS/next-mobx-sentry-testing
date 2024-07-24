// libs
import React, { FC } from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";

// constants
import { schema } from "./schema";

// models
import { Option } from "../../models";
import { OptionFormData } from "../../../../../../modules/ParameterOptions/models";
import { ParameterOption } from "../../../../../../modules/ParameterOptions/components/ParameterOptionsTable/models";
import { OptionPopperProps, OptionDefaultValues } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";

// api
import { createParameterOption } from "../../../../../../api/parameterOptions";

// helpers
import defaultResolver from "../../../../../uiKit/forms/FormContainer/resolver/defaultResolver";

// components
import Popper from "../../../../../uiKit/Popper/Popper";
import OptionForm from "./OptionForm";

const OptionPopper: FC<OptionPopperProps> = ({
    isOpen,
    defaultValue = null,
    items,
    sourceRef,
    offsetDistance = 20,
    offsetSkidding = 15,
    onClose,
    onSubmit,
}) => {
    const methods = useForm<OptionDefaultValues>({
        resolver: defaultResolver(schema),
        defaultValues: { name: defaultValue },
    });

    const { handleSubmit, reset } = methods;

    const {
        mutateAsync,
        error,
        isError,
        reset: resetMutation,
    } = useMutation<ServerResponse<ParameterOption>, AxiosError<BaseFormServerValidation>, OptionFormData>(
        createParameterOption,
        {
            onSuccess(queryData) {
                const { id, name } = queryData.data.data;
                onSubmitOption({
                    id,
                    value: id,
                    label: name,
                });
            },
        }
    );

    const onSubmitOption = (option: Option) => {
        onSubmit(option);
        onCloseForm();
    };

    const onSubmitForm = async (optionFields: OptionDefaultValues) => {
        const selectedOption = optionFields.name!;
        if (!selectedOption.__isNew__) {
            onSubmitOption(selectedOption);
            return;
        }
        try {
            await mutateAsync({ name: selectedOption.label });
        } catch (e) {}
    };

    const onCloseForm = () => {
        reset();
        resetMutation();
        onClose();
    };

    return (
        <Popper
            isOpen={isOpen}
            sourceRef={sourceRef}
            onClose={onCloseForm}
            className="z-50 max-w-400 w-full"
            placement="bottom"
            offsetDistance={offsetDistance}
            offsetSkidding={offsetSkidding}
            closeOnClickOnSource
        >
            <FormProvider {...methods}>
                <OptionForm
                    pickedOptions={items}
                    onClose={onCloseForm}
                    onSubmit={handleSubmit(onSubmitForm)}
                    errors={error}
                    isError={isError}
                />
            </FormProvider>
        </Popper>
    );
};

export default OptionPopper;
