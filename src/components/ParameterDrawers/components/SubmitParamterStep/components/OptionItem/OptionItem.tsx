// libs
import React, { FC, useRef } from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Identifier } from "dnd-core";

// hooks
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// icons
import DragIcon from "../../../../../uiKit/Icons/DragIcon";
import { XMarkIcon } from "@heroicons/react/20/solid";
import PencilIcon from "../../../../../uiKit/Icons/PencilIcon";

// components
import OptionPopper from "../OptionPopper/OptionPopper";

// models
import { OptionItemProps } from "./models";
import { defaultDropHover } from "../../../../../../shared/utils/dnd";

const OptionItem: FC<OptionItemProps> = ({ index, item, items, isDisabled, moveItem, onDelete, onEdit }) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const textRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [, drop] = useDrop<{ index: number }, void, { handlerId: Identifier | null }>({
        accept: "box",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(dndItem, monitor) {
            defaultDropHover(dndItem, index, monitor, moveItem, previewRef);
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

    drag(dragRef);
    drop(preview(previewRef));

    const opacity = isDragging ? 0 : 1;

    return (
        <div
            ref={previewRef}
            className={`w-full border border-dark-400 border-inset shadow-option-dnd p-3 flex items-center mb-2 rounded-md text-md ${
                isDisabled ? "bg-dark-100" : "bg-white"
            }`}
            style={{ opacity }}
        >
            <div ref={dragRef} className={`${isDisabled ? "w-0 h-0 hidden" : ""} basis-4 mr-5 cursor-grab`}>
                <DragIcon className="fill-dark-700" data-testid={`option-drag-icon-${index}`} />
            </div>

            <p
                ref={textRef}
                className={`mr-4 w-full break-word ${isDisabled ? "text-dark-700" : ""}`}
                data-testid={`parameter-option-${index}`}
            >
                {item.label}
            </p>
            <div className="flex items-center ml-auto gap-x-2">
                {!isDisabled && (
                    <>
                        <PencilIcon
                            className="w-5 h-5 fill-dark-700 cursor-pointer"
                            onClick={onOpen}
                            data-testid={`option-edit-icon-${index}`}
                        />
                        <XMarkIcon
                            className="w-5 h-5 text-dark-700 cursor-pointer"
                            onClick={onDelete}
                            data-testid={`option-delete-icon-${index}`}
                        />
                    </>
                )}
            </div>
            <OptionPopper
                isOpen={isOpen}
                sourceRef={textRef}
                onClose={onClose}
                items={items}
                defaultValue={item}
                onSubmit={onEdit}
            />
        </div>
    );
};

export default OptionItem;
