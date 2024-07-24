// libs
import React, { useRef } from "react";

// helpers
import { useDisclosure } from "../../../../../../../../shared/hooks/useDisclosure";

// models
import { IntervalsDescriptionsProps } from "./models";

// components
import QuestionMarkIcon from "../../../../../../../../components/uiKit/Icons/QuestionMarkIcon";
import Popper from "../../../../../../../../components/uiKit/Popper/Popper";

const IntervalsDescriptions = ({ referenceValues, groupTitle }: IntervalsDescriptionsProps) => {
    const buttonRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!referenceValues) return null;

    return (
        <>
            <span ref={buttonRef}>
                <QuestionMarkIcon className="w-6 h-6 cursor-pointer" onClick={onOpen} />
            </span>
            <Popper isOpen={isOpen} sourceRef={buttonRef} onClose={onClose} className="z-50" closeOnClickOnSource>
                <div className="w-full h-full text-sm bg-white rounded-lg shadow-datepicker p-4">
                    <div className="mb-2 px-3 text-lg font-bold">{groupTitle}</div>

                    <div className="grid grid-cols-4 border-b border-inset border-dark-400 uppercase text-xs text-dark-600 h-12 items-center px-3 gap-8">
                        <span className="col-span-1">from</span>
                        <span className="col-span-1">to</span>
                        <span className="col-span-2 pl-8">title</span>
                    </div>
                    {referenceValues.map(({ from, to, color, title, keyId }) => {
                        return (
                            <div
                                key={keyId}
                                className="grid grid-cols-4 h-12 items-center border-b border-inset border-dark-400 last:border-none px-3 gap-8"
                            >
                                <span className="col-span-1">{from}</span>
                                <span className="col-span-1">{to}</span>
                                <span className="flex items-center gap-3 col-span-2">
                                    <span
                                        className="w-5 h-5 rounded-full border border-dark-700"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span>{title}</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Popper>
        </>
    );
};

export default IntervalsDescriptions;
