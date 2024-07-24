import React, { FC } from "react";
import { observer } from "mobx-react";
import { useParameterConditionsStore } from "../../../../store";
import { TitleCellProps } from "./models";

const TitleCell: FC<TitleCellProps> = ({ conditionGroupIndex, rowIndex, onClick }) => {
    const {
        parameterConditionsStore: { conditionGroups, hasErrors, isIntervalHasErrors },
    } = useParameterConditionsStore();

    const title = conditionGroups[conditionGroupIndex].values[rowIndex].title;

    if (!title) {
        const hasError = hasErrors && isIntervalHasErrors(conditionGroupIndex, rowIndex, "isTitle");
        const errorClassName = hasError ? "border-b border-red-100" : "";

        return (
            <span onClick={onClick} className={`${errorClassName} px-1 cursor-pointer`}>
                Add title
            </span>
        );
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {title}
        </span>
    );
};

export default observer(TitleCell);
