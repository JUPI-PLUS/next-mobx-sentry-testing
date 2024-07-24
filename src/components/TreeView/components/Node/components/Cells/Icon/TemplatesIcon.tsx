// libs
import { FC, memo } from "react";

// models
import { TemplatesTreeNodeIconProps, TemplatesTypesEnum } from "../../../../../models";

// components
import KitIcon from "../../../../../../uiKit/Icons/KitIcon";
import FolderIcon from "../../../../../../uiKit/Icons/FolderIcon";
import ExamIcon from "../../../../../../uiKit/Icons/ExamIcon";
import FolderChevron from "./components/FolderChevron";

const TemplatesIcon: FC<TemplatesTreeNodeIconProps> = ({
    childVisible,
    isLoading,
    fullPath,
    hasChild,
    type,
    onIconClickHandler,
}) => {
    switch (type) {
        case TemplatesTypesEnum.GROUP:
            return (
                <div
                    className={`flex ${hasChild ? "cursor-pointer" : "mr-6"}`}
                    onClick={onIconClickHandler}
                    data-testid={`${fullPath}-folder-icon`}
                >
                    <FolderIcon className="fill-dark-700" />
                    {hasChild && <FolderChevron isLoading={isLoading} childVisible={childVisible} />}
                </div>
            );
        case TemplatesTypesEnum.KIT:
            return (
                <div className="self-center">
                    <KitIcon className="fill-brand-100" />
                </div>
            );

        case TemplatesTypesEnum.EXAM:
            return (
                <div className="self-center">
                    <ExamIcon className="fill-brand-100" />
                </div>
            );

        default:
            return <></>;
    }
};

export default memo(TemplatesIcon);
