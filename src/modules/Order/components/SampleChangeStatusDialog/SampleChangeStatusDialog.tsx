import { observer } from "mobx-react";
import { FC } from "react";
import Dialog from "../../../../components/uiKit/Dialog/Dialog";
import { SampleActionType } from "../../../../shared/models/business/sample";
import { SampleDetachExamsDialogProps } from "./models";
import { useOrderStore } from "../../store";

const SampleDetachExamsDialog: FC<SampleDetachExamsDialogProps> = ({ onSubmit }) => {
    const {
        orderStore: { sampleActionType, resetOrderExams, resetSampleActionType, resetIsSingleItemAction },
    } = useOrderStore();

    if (sampleActionType !== SampleActionType.DetachExams) return null;

    const onCloseDialog = () => {
        resetOrderExams();
        resetSampleActionType();
        resetIsSingleItemAction();
    };

    return (
        <Dialog
            isOpen
            onClose={onCloseDialog}
            onCancel={onCloseDialog}
            onSubmit={onSubmit}
            submitText="Delete"
            cancelText="Cancel"
            title="Delete sample?"
            couldCloseOnBackdrop
            couldCloseOnEsc
        >
            <span>Are you sure want to delete sample from examination?</span>
        </Dialog>
    );
};

export default observer(SampleDetachExamsDialog);
