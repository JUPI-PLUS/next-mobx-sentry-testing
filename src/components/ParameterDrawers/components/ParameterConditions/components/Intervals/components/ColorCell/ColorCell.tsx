// libs
import React, { FC, useRef } from "react";
import { observer } from "mobx-react";

// store
import { useParameterConditionsStore } from "../../../../store";

// helpers
import { useDisclosure } from "../../../../../../../../shared/hooks/useDisclosure";
import { getLookupItem } from "../../../../../../../../shared/utils/lookups";

// models
import { ColorCellProps } from "./models";
import { ID } from "../../../../../../../../shared/models/common";

// constants
import { DEFAULT_REFERENCE_COLOR } from "../../../../constants";

// components
import Popper from "../../../../../../../uiKit/Popper/Popper";
import ColorPicker from "./ColorPicker";
import ChevronDownIcon from "../../../../../../../uiKit/Icons/ChevronDownIcon";

const ColorCell: FC<ColorCellProps> = ({ conditionGroupIndex, rowIndex }) => {
    const buttonRef = useRef(null);

    const {
        parameterConditionsStore: { conditionGroups, referenceColorsLookup, setupIntervalColor },
    } = useParameterConditionsStore();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onColorChange = (colorId: ID) => {
        setupIntervalColor(colorId, conditionGroupIndex, rowIndex);
        onClose();
    };

    const selectedColor = getLookupItem(
        referenceColorsLookup,
        conditionGroups[conditionGroupIndex].values[rowIndex].color
    );

    if (!referenceColorsLookup.length) return null;

    return (
        <>
            <div className="flex items-center" onClick={onOpen} ref={buttonRef}>
                <div
                    className={"w-5 h-5 rounded-full border border-dark-700 border-inset"}
                    style={{
                        backgroundColor: `#${selectedColor?.label || DEFAULT_REFERENCE_COLOR.label}`,
                    }}
                />
                <ChevronDownIcon className="stroke-dark-900" />
            </div>
            <Popper
                isOpen={isOpen}
                sourceRef={buttonRef}
                onClose={onClose}
                className="z-50"
                placement="bottom"
                closeOnClickOnSource
            >
                <ColorPicker
                    colors={referenceColorsLookup}
                    selectedColorId={selectedColor?.value || DEFAULT_REFERENCE_COLOR.value}
                    onColorChange={onColorChange}
                />
            </Popper>
        </>
    );
};

export default observer(ColorCell);
