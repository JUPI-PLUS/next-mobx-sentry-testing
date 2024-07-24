import React, { ChangeEventHandler, FC, useMemo } from "react";
import { IndeterminateCheckboxValues } from "../../../uiKit/forms/Checkbox/models";
import IndeterminateCheckbox from "../../../uiKit/forms/Checkbox/IndeterminateCheckbox";

interface TableHeaderCheckboxProps {
    isAllRowsSelected: boolean;
    isSomeRowsSelected: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const TableHeaderCheckbox: FC<TableHeaderCheckboxProps> = ({ isAllRowsSelected, isSomeRowsSelected, onChange }) => {
    const checkboxValue = useMemo(() => {
        if (isAllRowsSelected) {
            return IndeterminateCheckboxValues.Checked;
        }

        if (isSomeRowsSelected) {
            return IndeterminateCheckboxValues.Indeterminate;
        }

        return IndeterminateCheckboxValues.Empty;
    }, [isAllRowsSelected, isSomeRowsSelected]);

    return <IndeterminateCheckbox value={checkboxValue} onChange={onChange} />;
};

export default React.memo(TableHeaderCheckbox);
