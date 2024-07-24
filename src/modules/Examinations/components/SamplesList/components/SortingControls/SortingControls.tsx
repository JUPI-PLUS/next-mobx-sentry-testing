// libs
import React, { useMemo, useRef } from "react";
import { observer } from "mobx-react";
import debounce from "lodash/debounce";

// stores
import { useExaminationStore } from "../../../../store";

// helpers
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// models
import { SortingByValues } from "../../../../models";

// constants
import { DEFAULT_DEBOUNCE_TIME, SORTING_BY_TITLES } from "../../../../constants";

// components
import { Tooltip } from "../../../../../../components/uiKit/Tooltip/Tooltip";
import { SortingWay } from "../../../../../../shared/models/common";
import SortingButton from "../../../../../../components/uiKit/SortingButton/SortingButton";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import Popper from "../../../../../../components/uiKit/Popper/Popper";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import CheckIcon from "../../../../../../components/uiKit/Icons/CheckIcon";

const SortingControls = () => {
    const buttonRef = useRef(null);
    const { isOpen, toggle, onClose } = useDisclosure();
    const {
        examinationStore: { sampleSorting, setupSamplesSorting },
    } = useExaminationStore();

    const debouncedHandler = useMemo(() => debounce(setupSamplesSorting, DEFAULT_DEBOUNCE_TIME), [setupSamplesSorting]);

    const onSortingWayClick = (value: SortingWay) => debouncedHandler("order_way", value);

    const onSortingByClick = (value: string) => {
        debouncedHandler("order_by", value);
        onClose();
    };

    return (
        <div className="flex items-center justify-between gap-2 w-full">
            <TextButton
                ref={buttonRef}
                type="button"
                text={
                    sampleSorting.order_by
                        ? `Sort by: ${SORTING_BY_TITLES[sampleSorting.order_by as SortingByValues].toLowerCase()}`
                        : "Sort by"
                }
                onClick={toggle}
                size="thin"
                variant="transparent"
                endIcon={isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                data-testid="order-by-button"
            />
            <Popper isOpen={isOpen} sourceRef={buttonRef} onClose={onClose} placement="bottom-start" offsetDistance={8}>
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    {Object.entries(SORTING_BY_TITLES).map(([key, value]) => (
                        <li
                            key={key}
                            className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md flex items-center gap-3"
                            onClick={() => onSortingByClick(key)}
                            data-testid={`order-by-${key}`}
                        >
                            {value}
                            {sampleSorting.order_by === key && <CheckIcon className="stroke-dark-900" />}
                        </li>
                    ))}
                </ul>
            </Popper>
            <Tooltip text="Sorting way" isStatic placement="right" offsetDistance={15}>
                <SortingButton sortDirection={sampleSorting.order_way} onClick={onSortingWayClick} />
            </Tooltip>
        </div>
    );
};

export default observer(SortingControls);
