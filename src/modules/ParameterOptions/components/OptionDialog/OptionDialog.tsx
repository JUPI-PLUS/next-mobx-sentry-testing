// libs
import React, { FC } from "react";

// components
import FormDialog from "../../../../components/uiKit/Dialog/FormDialog";
import DialogFormContent from "./DialogFormContent";

// models
import { OptionDialogProps } from "./models";

// schema
import { schema } from "./schema";

const OptionDialog: FC<OptionDialogProps> = ({
    title,
    submitText,
    isOpen,
    defaultValues,
    error,
    onSubmit,
    onClose,
}) => {
    return (
        <FormDialog
            title={title}
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onClose={onClose}
            isOpen={isOpen}
            onCancel={onClose}
            cancelText="Cancel"
            submitText={submitText}
        >
            <DialogFormContent error={error} />
        </FormDialog>
    );
};

export default OptionDialog;
