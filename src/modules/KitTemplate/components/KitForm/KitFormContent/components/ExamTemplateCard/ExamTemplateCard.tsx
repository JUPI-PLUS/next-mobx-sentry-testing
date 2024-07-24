// libs
import { observer } from "mobx-react";
import { FC, useRef } from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Identifier } from "dnd-core";

// stores
import { useKitTemplateStore } from "../../../../../store";

// helpers
import { defaultDropHover } from "../../../../../../../shared/utils/dnd";
import { getLookupItem } from "../../../../../../../shared/utils/lookups";

// models
import { ExamTemplateCardProps } from "./models";

// components
import { DragIcon } from "../../../../../../../components/uiKit/Icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../../../../../../../components/uiKit/Button/Button";
import Dot from "../../../../../../../components/uiKit/Dot/Dot";

const ExamTemplateCard: FC<ExamTemplateCardProps> = ({
    examTemplate,
    errorMessage = "",
    onRemoveClick,
    onMoveCard,
    index,
}) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const {
        kitTemplateStore: { examTemplateStatusesLookup },
    } = useKitTemplateStore();

    const currentExamTemplateStatusLabel = getLookupItem(examTemplateStatusesLookup, examTemplate.status_id)?.label;
    const currentExamTemplateSampleTypeName = examTemplate.sample_types_name;

    const [, drop] = useDrop<{ index: number }, void, { handlerId: Identifier | null }>({
        accept: "box",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(dndItem, monitor) {
            defaultDropHover(dndItem, index, monitor, onMoveCard, previewRef);
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: "box",
        item: () => {
            return { index };
        },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(dragRef);
    drop(preview(previewRef));

    return (
        <div ref={previewRef} style={{ opacity }}>
            <div
                className={`flex items-center justify-between border border-inset p-3 rounded-md ${
                    errorMessage ? `border-red-100` : `border-dark-700`
                }`}
            >
                <div ref={dragRef} className="basis-4 mr-5 cursor-grab">
                    <DragIcon className="fill-dark-700" data-testid={`option-drag-icon-${index}`} />
                </div>
                <div className="flex flex-col justify-center flex-1">
                    <div className="text-md font-bold text-dark-900 mb-1">{examTemplate.name}</div>
                    <div className="flex gap-x-2 items-start text-sm text-dark-900">
                        {examTemplate.code && (
                            <div className="flex gap-1">
                                <span className="text-dark-700 shrink-0">Code: </span>
                                {examTemplate.code}
                            </div>
                        )}
                        {examTemplate.code && <Dot className="mt-2" />}
                        {currentExamTemplateSampleTypeName && (
                            <div className="flex gap-1">
                                <span className="text-dark-700 shrink-0">Sample type: </span>
                                <span className="break-word">{currentExamTemplateSampleTypeName}</span>
                            </div>
                        )}
                        {currentExamTemplateSampleTypeName && <Dot className="mt-2" />}
                        {currentExamTemplateStatusLabel && (
                            <div className="flex gap-1">
                                <span className="text-dark-700 shrink-0">Status: </span>
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
                    data-testid={`remove-exam-template-${examTemplate.name}-button`}
                >
                    <XMarkIcon className="text-dark-700 stroke-1" />
                </IconButton>
            </div>
            {errorMessage && <span className="text-red-100 text-sm">{errorMessage}</span>}
        </div>
    );
};

export default observer(ExamTemplateCard);
