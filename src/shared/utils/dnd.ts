import { RefObject } from "react";
import { DropTargetMonitor, XYCoord } from "react-dnd";

export const defaultDropHover = (
    dndItem: { index: number },
    index: number,
    monitor: DropTargetMonitor,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
    previewRef: RefObject<HTMLDivElement>
) => {
    if (!previewRef.current) {
        return;
    }
    const dragIndex = dndItem.index;
    const hoverIndex = index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
        return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
    }

    // Time to actually perform the action
    moveItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    dndItem.index = hoverIndex;
};
