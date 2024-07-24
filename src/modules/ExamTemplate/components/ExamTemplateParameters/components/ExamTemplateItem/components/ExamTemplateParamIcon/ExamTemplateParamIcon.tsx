// libs
import { FC, memo } from "react";

// models
import { ExamTemplateParamTypesEnum } from "../../../../models";
import { ExamTemplateParamIconProps } from "./models";

// components
import ExamIcon from "../../../../../../../../components/uiKit/Icons/ExamIcon";
import FolderIcon from "../../../../../../../../components/uiKit/Icons/FolderIcon";
import ExamTemplateFolderChevron from "../ExamTemplateParamFolderChevron/ExamTemplateParamIcon";

const ExamTemplateParamIcon: FC<ExamTemplateParamIconProps> = ({
    type,
    detailsOpen,
    onToggleDetailsOpen,
    shouldShowChevron = true,
    uuid,
}) => {
    return (
        <div
            className="flex cursor-pointer"
            onClick={onToggleDetailsOpen}
            data-testid={`parameter-open-button-${uuid}`}
        >
            {type === ExamTemplateParamTypesEnum.GROUP ? (
                <FolderIcon className="fill-dark-700" />
            ) : (
                <ExamIcon className="fill-dark-700" />
            )}
            {shouldShowChevron && (
                <ExamTemplateFolderChevron isChildVisible={detailsOpen} dataTestId={`parameter-open-icon-${uuid}`} />
            )}
        </div>
    );
};

export default memo(ExamTemplateParamIcon);
