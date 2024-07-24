// helpers
import useScrollToBottom from "../../../../../../../../shared/hooks/useScrollToBottom";

// models
import { AddExamButtonProps } from "../../../models";

// components
import { PlusIcon } from "@heroicons/react/24/outline";
import { TextButton } from "../../../../../../../../components/uiKit/Button/Button";

const AddExamButton = ({ onClick, shouldScrollToBottom }: AddExamButtonProps) => {
    useScrollToBottom("scrollable_element", shouldScrollToBottom);

    return (
        <TextButton
            className="text-brand-100 font-medium"
            variant="transparent"
            size="thin"
            onClick={onClick}
            text="Add exam template"
            type="button"
            startIcon={<PlusIcon className="w-6 h-6" />}
            data-testid="add-exam-template"
        />
    );
};

export default AddExamButton;
