// libs
import { FC, memo } from "react";

// models
import { ExamTemplateFolderChevronProps } from "./models";

// components
import ChevronUpIcon from "../../../../../../../../components/uiKit/Icons/ChevronUpIcon";
import ChevronDownIcon from "../../../../../../../../components/uiKit/Icons/ChevronDownIcon";

const ExamTemplateFolderChevron: FC<ExamTemplateFolderChevronProps> = ({ isChildVisible, dataTestId = "" }) =>
    isChildVisible ? (
        <ChevronUpIcon className="stroke-dark-700" data-testid={dataTestId} />
    ) : (
        <ChevronDownIcon className="stroke-dark-700" data-testid={dataTestId} />
    );

export default memo(ExamTemplateFolderChevron);
