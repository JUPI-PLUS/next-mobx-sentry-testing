// libs
import { FC, memo } from "react";

// models
import { IconSwitcherProps } from "../../../../../../../models";
import { TemplateTypeEnum } from "../../../../../../../../../shared/models/business/template";

// components
import KitTemplateIcon from "../../../../../../../../../components/uiKit/Icons/KitTemplateIcon";
import ExamTemplateIcon from "../../../../../../../../../components/uiKit/Icons/ExamTemplateIcon";
import FolderTemplateIcon from "../../../../../../../../../components/uiKit/Icons/FolderTemplateIcon";

const IconSwitcher: FC<IconSwitcherProps> = ({ type }) => {
    switch (type) {
        case TemplateTypeEnum.GROUP:
            return (
                <div className="self-center">
                    <FolderTemplateIcon className="fill-dark-700" />
                </div>
            );
        case TemplateTypeEnum.KIT:
            return (
                <div className="self-center">
                    <KitTemplateIcon className="fill-brand-100" />
                </div>
            );

        case TemplateTypeEnum.EXAM:
            return (
                <div className="self-center">
                    <ExamTemplateIcon className="fill-brand-100" />
                </div>
            );

        default:
            return <></>;
    }
};

export default memo(IconSwitcher);
