// libs
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { FC, useRef } from "react";

// components
import OptionsContainer from "../OptionsContainer/OptionsContainer";
import { TextButton } from "../../../../../uiKit/Button/Button";
import OptionPopper from "../OptionPopper/OptionPopper";

// models
import { Option, OptionsContainerProps } from "../../models";

// icons
import { PlusIcon } from "@heroicons/react/20/solid";

// hooks
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// constants
import { COUNT_VALIDATION } from "../../../../../../shared/validation/rules";

const DropdownOptionsContainer: FC<OptionsContainerProps> = ({ items, setItems, isDisabled }) => {
    const addOptionContainerRef = useRef(null);
    const { isOpen, onClose, onOpen } = useDisclosure();

    const onOptionSubmit = (option: Option) => {
        setItems(prevItems => [...prevItems, option]);
    };

    const canAddNewOption = items.length < COUNT_VALIDATION.MAX_PARAMETER_OPTIONS_COUNT;

    return (
        <div>
            <p className="text-dark-800 text-xs font-medium mb-1.5">Options list</p>
            <DndProvider backend={HTML5Backend}>
                <OptionsContainer isDisabled={isDisabled} items={items} setItems={setItems} />
            </DndProvider>
            <div className="mt-4" ref={addOptionContainerRef}>
                {canAddNewOption && !isDisabled && (
                    <TextButton
                        type="button"
                        text="Add option"
                        variant="transparent"
                        size="thin"
                        className="font-medium text-brand-100"
                        onClick={onOpen}
                        startIcon={<PlusIcon className="w-4 h-4" />}
                        data-testid="add-option-button"
                    />
                )}
            </div>
            <OptionPopper
                isOpen={isOpen}
                sourceRef={addOptionContainerRef}
                offsetSkidding={0}
                offsetDistance={10}
                onClose={onClose}
                onSubmit={onOptionSubmit}
                items={items}
            />
        </div>
    );
};

export default DropdownOptionsContainer;
