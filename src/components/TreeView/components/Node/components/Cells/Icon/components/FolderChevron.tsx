// libs
import { FC, memo } from "react";

// models
import { TemplatesTreeNodeIconProps } from "../../../../../../models";

// components
import ChevronDownIcon from "../../../../../../../uiKit/Icons/ChevronDownIcon";
import ChevronUpIcon from "../../../../../../../uiKit/Icons/ChevronUpIcon";

const FolderChevron: FC<Pick<TemplatesTreeNodeIconProps, "isLoading" | "childVisible">> = ({
    isLoading,
    childVisible,
}) => {
    if (isLoading)
        return (
            <div className="w-6 h-6 flex justify-center items-center">
                <span className="animate-ping h-1 w-1 rounded-full bg-brand-100" />
            </div>
        );

    if (childVisible) return <ChevronUpIcon className="stroke-dark-700" />;

    return <ChevronDownIcon className="stroke-dark-700" />;
};

export default memo(FolderChevron);
