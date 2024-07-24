import React, { FC } from "react";
import Dialog from "../../../../../../../uiKit/Dialog/Dialog";
import { FormProvider, useForm } from "react-hook-form";
import defaultResolver from "../../../../../../../uiKit/forms/FormContainer/resolver/defaultResolver";
import { useParameterConditionsStore } from "../../../../store";
import { observer } from "mobx-react";
import { NotesDialogFormData, NotesDialogProps } from "./models";
import { schema } from "./schema";
import FormRichText from "../../../../../../../uiKit/RichText/FormRichText";

const NotesDialog: FC<NotesDialogProps> = ({ onClose, rowIndex, conditionGroupIndex }) => {
    const {
        parameterConditionsStore: { setupIntervalValueNotes, conditionGroups },
    } = useParameterConditionsStore();

    const defaultNotes = conditionGroups[conditionGroupIndex].values[rowIndex].note;

    const formMethods = useForm({
        defaultValues: {
            intervalNotes: defaultNotes,
        },
        mode: "onSubmit",
        resolver: defaultResolver(schema),
    });

    const onSubmit = (formData: NotesDialogFormData) => {
        setupIntervalValueNotes(formData.intervalNotes, conditionGroupIndex, rowIndex);
        formMethods.reset();
        onClose();
    };

    return (
        <Dialog
            isOpen
            title="Add notes"
            submitText="Save"
            cancelText="Cancel"
            containerClass="max-w-xl"
            onSubmit={formMethods.handleSubmit(onSubmit)}
            onClose={onClose}
            onCancel={onClose}
        >
            <FormProvider {...formMethods}>
                <FormRichText name="intervalNotes" autoFocus />
            </FormProvider>
        </Dialog>
    );
};

export default observer(NotesDialog);
