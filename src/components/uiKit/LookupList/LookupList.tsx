// libs
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { ChangeEvent, FC, useMemo, useRef, useState } from "react";
import range from "lodash/range";

// models
import { ID } from "../../../shared/models/common";
import { LookupListProps } from "./models";

// hooks
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

// components
import { OutlineButton, SolidButton, TextButton } from "../Button/Button";
import Input from "../forms/Inputs/CommonInput/Input";
import CheckIcon from "../Icons/CheckIcon";
import Popper from "../Popper/Popper";

// TODO: Come up with a universal name of component
const LookupList: FC<LookupListProps> = ({
    children,
    className = "",
    placement = "bottom-start",
    matchField,
    selectedLookups,
    placeholder,
    lookups,
    offsetDistance = 5,
    offsetSkidding = 0,
    disabled = false,
    onReset,
    onSubmit,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [matchValue, setMatchValue] = useState("");
    const [selectedLookupsValues, setSelectedLookupsValues] = useState<Set<ID>>(new Set());
    const [lastSelectedLookupIndex, setLastSelectedLookupIndex] = useState<number>(0);

    const filteredLookups = useMemo(() => {
        if (!matchValue) return lookups;

        return lookups.filter(lookupItem => {
            if (Array.isArray(matchField)) {
                return matchField.some(field => {
                    const matchFieldValue = lookupItem[field].toString().toLowerCase();
                    return matchFieldValue.includes(matchValue);
                });
            }
            const matchFieldValue = lookupItem[matchField].toString().toLowerCase();
            return matchFieldValue.includes(matchValue);
        });
    }, [matchValue, lookups, matchField]);

    const onClearInput = () => {
        setMatchValue("");
    };

    const onInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMatchValue(event.target.value);
    };

    const onItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, value: ID, itemIndex: number) => () => {
        if (!event.shiftKey) {
            // shift creates a set from selected values set (range)
            const draft = new Set<ID>(selectedLookupsValues);
            setLastSelectedLookupIndex(itemIndex);
            if (draft.has(value)) {
                draft.delete(value);
            } else {
                draft.add(filteredLookups[itemIndex].value);
            }
            setSelectedLookupsValues(draft);
        } else {
            // shift creates a new set (range)
            const draft = new Set<ID>();
            let selectedRange;
            if (itemIndex > lastSelectedLookupIndex) {
                selectedRange = range(lastSelectedLookupIndex, itemIndex);
            } else {
                selectedRange = range(lastSelectedLookupIndex, itemIndex);
            }
            selectedRange.forEach(lookupIndex => {
                draft.add(filteredLookups[lookupIndex].value);
            });

            // adding the item we clicked on
            draft.add(filteredLookups[itemIndex].value);
            // setting everything to state
            setSelectedLookupsValues(draft);
        }
    };

    const onCancelHandler = () => {
        onClose();
        onClearInput();
    };

    const onOpenHandler = () => {
        if (disabled) return;
        setSelectedLookupsValues(new Set(selectedLookups.map(({ value }) => value)));
        onOpen();
    };

    const onResetHandler = () => {
        onReset();
        onCancelHandler();
    };

    const onSubmitHandler = () => {
        onSubmit(lookups.filter(lookupItem => selectedLookupsValues.has(lookupItem.value)));
        onCancelHandler();
    };

    return (
        <>
            <div onClick={onOpenHandler} ref={containerRef} className={`cursor-pointer ${className}`}>
                {children}
            </div>
            <Popper
                isOpen={isOpen}
                sourceRef={containerRef}
                placement={placement}
                onClose={onClose}
                className="bg-white shadow-datepicker w-80 rounded-md"
                offsetDistance={offsetDistance}
                offsetSkidding={offsetSkidding}
            >
                <>
                    <Input
                        data-testid="lookup-list-search-input"
                        inputClassName="!border-none !max-h-min h-14"
                        onChange={onInputValueChange}
                        placeholder={placeholder}
                        value={matchValue}
                        endIcon={
                            matchValue ? (
                                <XMarkIcon
                                    data-testid="reset-icon"
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={onClearInput}
                                />
                            ) : undefined
                        }
                        startIcon={<MagnifyingGlassIcon data-testid="search-icon" className="w-5 h-5" />}
                    />
                    <ul className="min-h-52 max-h-96 py-3 border-t overflow-auto">
                        {filteredLookups?.map(({ value, label }, index) => {
                            const isItemSelected = selectedLookupsValues.has(value);
                            return (
                                <li
                                    key={value}
                                    className="px-5 py-2 min-h-10 text-md hover:bg-dark-100 cursor-pointer flex justify-between items-center gap-3 select-none"
                                    onClick={e => onItemClick(e, value, index)()}
                                    data-testid={`lookup-list-item-${value}`}
                                >
                                    <span className="break-word">{label}</span>
                                    {isItemSelected && (
                                        <CheckIcon
                                            className="stroke-dark-900 shrink-0"
                                            data-testid={`checked-lookup-list-item-${value}`}
                                        />
                                    )}
                                </li>
                            );
                        })}
                        {!filteredLookups?.length && (
                            <div className="mt-10 text-center" data-testid="nothing-found">
                                Nothing found
                            </div>
                        )}
                    </ul>
                    <div className="flex items-center justify-between border-t p-3 pl-5">
                        <TextButton
                            text="Reset"
                            size="thin"
                            variant="neutral"
                            className="text-sm font-medium cursor-pointer"
                            onClick={onResetHandler}
                            data-testid="lookup-list-reset-button"
                        />
                        <div className="flex">
                            <OutlineButton
                                text="Cancel"
                                onClick={onCancelHandler}
                                data-testid="lookup-list-cancel-button"
                                className="mr-3"
                                size="xs"
                            />
                            <SolidButton
                                text="Submit"
                                onClick={onSubmitHandler}
                                data-testid="lookup-list-submit-button"
                                size="xs"
                            />
                        </div>
                    </div>
                </>
            </Popper>
        </>
    );
};

export default LookupList;
