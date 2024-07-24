// libs
import React, { FC, useRef } from "react";
import { observer } from "mobx-react";

// components
import FolderIcon from "../../../../../uiKit/Icons/FolderIcon";
import GroupActions from "../GroupActions";
import Conditions from "../Conditions/Conditions";
import Intervals from "../Intervals/Intervals";
import Accordion from "../../../../../uiKit/Accodion/Accordion";
import GroupTitle from "./components/GroupTitle";

// store
import { useParameterConditionsStore } from "../../store";

// models
import { ConditionGroupProps } from "./models";

const ConditionGroup: FC<ConditionGroupProps> = ({ id, index, isDefault }) => {
    const element = useRef<HTMLDivElement>(null);
    const {
        parameterConditionsStore: {
            conditionGroups,
            movedConditionsIds,
            hasErrors,
            isConditionGroupHasError,
            removeMovedConditionGroups,
        },
    } = useParameterConditionsStore();

    const onAnimationStart = () => {
        element.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const onAnimationEnd = () => {
        removeMovedConditionGroups();
    };

    const accordionContainerClassName = movedConditionsIds.includes(id) ? "animate-groupBounce" : "";
    const accordionErrorClassName =
        hasErrors && isConditionGroupHasError(index) ? "border-4 border-red-100" : "border-dark-400";

    return (
        <div
            ref={element}
            className={accordionContainerClassName}
            onAnimationStart={onAnimationStart}
            onAnimationEnd={onAnimationEnd}
        >
            <Accordion
                isOpen={true}
                title={<GroupTitle index={index} isDefault={isDefault} />}
                containerClassName={`border rounded-lg mb-4 transition-all duration-300 ${accordionErrorClassName}`}
                titleOpenContainerClassName="border-t-0 border-r-0 border-l-0 border-b rounded-none px-6 py-5 font-bold"
                titleCloseContainerClassName="border-t-0 border-r-0 border-l-0 border-b-0 rounded-none px-6 py-5 font-bold"
                startActions={<FolderIcon className="fill-dark-700" />}
                endActions={
                    !isDefault && (
                        <GroupActions
                            groupId={id}
                            groupIndex={index}
                            isMoveUpDisabled={index === 0}
                            isMoveDownDisabled={index === conditionGroups.length - 2} // - 2 because we have default group in array
                        />
                    )
                }
            >
                <div className="pl-4 pr-3 py-4">
                    {!isDefault && <Conditions index={index} />}
                    <Intervals index={index} />
                </div>
            </Accordion>
        </div>
    );
};

export default observer(ConditionGroup);
