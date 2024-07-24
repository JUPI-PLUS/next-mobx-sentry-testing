import { FC } from "react";
import { observer } from "mobx-react";
import { IndeterminateCheckboxValues } from "../../../../../../../../../components/uiKit/forms/Checkbox/models";
import IndeterminateCheckbox from "../../../../../../../../../components/uiKit/forms/Checkbox/IndeterminateCheckbox";
import { useOrderStore } from "../../../../../../../store";
import { OrderExamDetails } from "../../../../../../../models";

interface ExamGroupCheckboxProps {
    exams: OrderExamDetails[];
}

const ExamGroupCheckbox: FC<ExamGroupCheckboxProps> = ({ exams }) => {
    const {
        orderStore: { setupOrderExams, resetOrderExams, selectAllExamsValue, isSelectAllExamsDisabled },
    } = useOrderStore();

    const defaultSampleType = exams[0].sample_type;
    const indeterminateCheckboxValue = selectAllExamsValue(exams);
    const isDisabled = isSelectAllExamsDisabled(exams, defaultSampleType);
    const isChecked = indeterminateCheckboxValue === IndeterminateCheckboxValues.Checked;

    const onSelectAllChange = () => {
        if (indeterminateCheckboxValue === IndeterminateCheckboxValues.Empty) {
            setupOrderExams(exams);
        } else {
            resetOrderExams();
        }
    };

    return (
        <IndeterminateCheckbox
            value={indeterminateCheckboxValue}
            onChange={onSelectAllChange}
            checked={isChecked}
            disabled={isDisabled}
            className="mr-2"
            data-testid={`${defaultSampleType}-group-checkbox`}
        />
    );
};

export default observer(ExamGroupCheckbox);
