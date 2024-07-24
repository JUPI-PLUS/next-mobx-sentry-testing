import React, { FC, useEffect } from "react";
import Dialog from "../../../../../../../uiKit/Dialog/Dialog";
import { FormProvider, useForm } from "react-hook-form";
import defaultResolver from "../../../../../../../uiKit/forms/FormContainer/resolver/defaultResolver";
import FormInput from "../../../../../../../uiKit/forms/Inputs/CommonInput/FormInput";
import { useParameterConditionsStore } from "../../../../store";
import { observer } from "mobx-react";
import { schema } from "./schema";
import { TitleDialogFormData, TitleDialogProps } from "./models";

const TitleDialog: FC<TitleDialogProps> = ({ onClose, rowIndex, conditionGroupIndex }) => {
    const {
        parameterConditionsStore: { setupIntervalValueTitle, conditionGroups },
    } = useParameterConditionsStore();

    const defaultTitle = conditionGroups[conditionGroupIndex].values[rowIndex].title;

    const formMethods = useForm({
        defaultValues: {
            title: defaultTitle,
        },
        mode: "onSubmit",
        resolver: defaultResolver(schema),
    });

    const onSubmit = (formData: TitleDialogFormData) => {
        setupIntervalValueTitle(formData.title, conditionGroupIndex, rowIndex);
        formMethods.reset();
        onClose();
    };

    useEffect(() => {
        const onKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                formMethods.handleSubmit(onSubmit)();
            }
        };

        window.addEventListener("keypress", onKeyPress);
        return () => {
            window.removeEventListener("keypress", onKeyPress);
        };
    }, []);

    return (
        <Dialog
            isOpen
            title={defaultTitle ? "Edit title" : "Add title"}
            submitText="Save"
            cancelText="Cancel"
            onSubmit={formMethods.handleSubmit(onSubmit)}
            onClose={onClose}
            onCancel={onClose}
        >
            <FormProvider {...formMethods}>
                <FormInput name="title" autoFocus />
            </FormProvider>
        </Dialog>
    );
};

export default observer(TitleDialog);
