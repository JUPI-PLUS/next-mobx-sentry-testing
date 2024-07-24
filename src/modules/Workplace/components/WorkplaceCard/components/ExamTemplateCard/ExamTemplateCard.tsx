// libs
import { observer } from "mobx-react";

// stores
import { useWorkplaceStore } from "../../../../store";

// helpers
import { getLookupItem } from "../../../../../../shared/utils/lookups";

// models
import { ExamTemplateCardProps } from "./models";

// components
import Dot from "../../../../../../components/uiKit/Dot/Dot";
import { IconButton } from "../../../../../../components/uiKit/Button/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ExamTemplateCard = ({ examTemplate, errorMessage = "", onRemoveClick }: ExamTemplateCardProps) => {
    const {
        workplaceStore: { examTemplateStatusesLookup },
    } = useWorkplaceStore();

    const currentExamTemplateStatusLabel = getLookupItem(examTemplateStatusesLookup, examTemplate.status_id)?.label;

    return (
        <div>
            <div
                className={`flex items-center justify-between border border-inset p-3 rounded-md ${
                    errorMessage ? `border-red-100` : `border-dark-700`
                }`}
            >
                <div className="flex flex-col justify-center">
                    <div className="text-md font-bold text-dark-900 mb-1">{examTemplate.name}</div>
                    <div className="flex gap-x-2 items-center text-sm text-dark-900">
                        {examTemplate.code && (
                            <div>
                                <span className="text-dark-700">Code: </span>
                                {examTemplate.code}
                            </div>
                        )}
                        <Dot />
                        {currentExamTemplateStatusLabel && (
                            <div>
                                <span className="text-dark-700">Status: </span>
                                {currentExamTemplateStatusLabel}
                            </div>
                        )}
                    </div>
                </div>
                <IconButton
                    aria-label={`Remove exam template ${examTemplate.name}`}
                    variant="transparent"
                    size="thin"
                    className="w-6 h-6"
                    type="button"
                    onClick={onRemoveClick}
                    data-testid="remove-exam-template-button"
                >
                    <XMarkIcon className="text-dark-700 stroke-1" />
                </IconButton>
            </div>
            {errorMessage && <span className="text-red-100 text-sm">{errorMessage}</span>}
        </div>
    );
};

export default observer(ExamTemplateCard);
