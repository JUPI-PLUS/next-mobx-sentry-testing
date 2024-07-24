//  libs
import React, { FC } from "react";

// helpers
import { openInNewTab } from "../../../../../../../../../shared/utils/events";
import { nextJSUrlToString } from "../../../../../../../../../shared/utils/routing";

//  models
import { SampleActionType } from "../../../../../../../../../shared/models/business/sample";

// constants
import { ROUTES } from "../../../../../../../../../shared/constants/routes";

export interface ActionOptionsProps {
    onItemClick: (type: SampleActionType) => void;
    isMarkAsDamagedItemVisible: boolean;
    sampleUUID?: string;
}

const ActionOptions: FC<ActionOptionsProps> = ({ onItemClick, isMarkAsDamagedItemVisible, sampleUUID }) => {
    const onPreviewClick = () => {
        openInNewTab(
            nextJSUrlToString({
                pathname: ROUTES.examinations.preview.route,
                query: { uuid: sampleUUID },
            })
        );
    };

    return (
        <ul className="bg-white shadow-dropdown py-3 rounded-md">
            <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                data-testid="view-details-item"
                onClick={() => onItemClick(SampleActionType.Details)}
            >
                <p className="text-md font-semibold">View details</p>
            </li>
            <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                data-testid="view-preview-item"
                onClick={onPreviewClick}
            >
                <p className="text-md font-semibold">View preview</p>
            </li>
            {isMarkAsDamagedItemVisible && (
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    data-testid="mark-as-damaged-item"
                    onClick={() => onItemClick(SampleActionType.ChangeStatus)}
                >
                    <p className="text-md font-semibold">Mark as damaged</p>
                </li>
            )}
        </ul>
    );
};

export default ActionOptions;
