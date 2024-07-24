import { ChangeEvent, FC } from "react";
import { observer } from "mobx-react";
import Checkbox from "../../../../../../../../../components/uiKit/forms/Checkbox/Checkbox";

import { useOrderStore } from "../../../../../../../store";
import { OrderExamDetails } from "../../../../../../../models";

interface ExamCheckboxProps {
    exam: OrderExamDetails;
}

const ExamCheckbox: FC<ExamCheckboxProps> = ({ exam }) => {
    const {
        orderStore: { setupOrderExam, removeOrderExam, selectedExams, isExamCheckboxDisabled, isSingleItemAction },
    } = useOrderStore();

    const onChangeCheckboxHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.checked) {
            setupOrderExam(exam);
        } else {
            removeOrderExam(exam.exam_uuid);
        }
    };

    const isDisabled = isExamCheckboxDisabled(exam);
    const isChecked = !isSingleItemAction && selectedExams.has(exam.exam_uuid);

    return (
        <Checkbox
            className="mr-2"
            checked={isChecked}
            disabled={isDisabled}
            onChange={onChangeCheckboxHandler}
            data-testid={`exam-checkbox-${exam.exam_uuid}`}
        />
    );
};

export default observer(ExamCheckbox);
