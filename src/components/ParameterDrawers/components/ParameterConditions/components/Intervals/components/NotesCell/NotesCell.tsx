import React, { FC } from "react";
import { observer } from "mobx-react";
import { useParameterConditionsStore } from "../../../../store";
import { NotesCellProps } from "./models";

const NotesCell: FC<NotesCellProps> = ({ conditionGroupIndex, rowIndex, onClick }) => {
    const {
        parameterConditionsStore: { conditionGroups },
    } = useParameterConditionsStore();

    const isIntervalNotesExists = Boolean(conditionGroups[conditionGroupIndex].values[rowIndex].note);

    if (isIntervalNotesExists) {
        return (
            <span onClick={onClick} className="cursor-pointer">
                Read note
            </span>
        );
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            Add note
        </span>
    );
};

export default observer(NotesCell);
