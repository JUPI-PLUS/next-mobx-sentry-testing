//  libs
import { FC } from "react";

//  helpers
import { schema } from "./schema";

//  models
import { SampleEditMarkAsDamagedNoteDrawerProps } from "./models";

//  components
import FormDrawer from "../../uiKit/Drawer/FormDrawer";
import FormTextArea from "../../uiKit/forms/TextArea/FormTextArea";
import ExamsThatWillBeFailed from "../SamplingDrawer/components/ExamsThatWillBeFailed";

const defaultValues = {
    notes: "",
};

const SampleEditMarkAsDamagedNoteDrawer: FC<SampleEditMarkAsDamagedNoteDrawerProps> = ({
    exams,
    isOpen,
    onSubmit,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <FormDrawer
            isOpen
            schema={schema}
            defaultValues={defaultValues}
            onClose={onClose}
            onCancel={onClose}
            onSubmit={onSubmit}
            submitText="Save"
            title="Edit note"
            side="right"
            size="lg"
            containerClass="z-50"
            childrenContainerClass="flex flex-col gap-4"
            couldCloseOnBackdrop
            couldCloseOnEsc
        >
            <>
                <ExamsThatWillBeFailed exams={exams} />
                <FormTextArea name="notes" label="Note" />
            </>
        </FormDrawer>
    );
};

export default SampleEditMarkAsDamagedNoteDrawer;
