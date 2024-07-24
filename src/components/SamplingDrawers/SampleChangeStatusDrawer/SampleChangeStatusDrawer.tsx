//  libs
import { FC } from "react";

//  helpers
import { schema } from "./schema";

//  models
import { SampleChangeStatusDrawerProps } from "./models";

//  components
import FormDrawer from "../../uiKit/Drawer/FormDrawer";
import SampleChangeStatusForm from "../../../modules/Order/components/SampleChangeStatusForm/SampleChangeStatusForm";
import ExamsThatWillBeFailed from "../SamplingDrawer/components/ExamsThatWillBeFailed";

const defaultValues = {
    updated_at: { from: new Date() },
    damage_reason: null,
};

const SampleChangeStatusDrawer: FC<SampleChangeStatusDrawerProps> = ({ isOpen, exams, onSubmit, onClose }) => {
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
            title="Mark sample as damaged"
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="lg"
            containerClass="z-50"
            childrenContainerClass="flex flex-col gap-4"
        >
            <>
                <ExamsThatWillBeFailed exams={exams} />
                <SampleChangeStatusForm />
            </>
        </FormDrawer>
    );
};

export default SampleChangeStatusDrawer;
