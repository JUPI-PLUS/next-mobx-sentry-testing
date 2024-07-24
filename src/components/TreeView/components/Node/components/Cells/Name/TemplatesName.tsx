// libs
import { FC } from "react";

// models
import { TemplatesNodeNameProps, TemplatesTypesEnum } from "../../../../../models";

// components
import TemplatesIcon from "../Icon/TemplatesIcon";

const TemplatesName: FC<TemplatesNodeNameProps> = ({
    type,
    nodeName,
    childVisible,
    isLoading,
    fullPath,
    hasChild,
    onIconClickHandler,
}) => {
    return (
        <div className={`flex w-full items-center ${type !== TemplatesTypesEnum.GROUP ? "gap-3" : ""}`}>
            <TemplatesIcon
                fullPath={fullPath}
                type={type}
                hasChild={hasChild}
                onIconClickHandler={onIconClickHandler}
                isLoading={isLoading}
                childVisible={childVisible}
            />
            <span className="text-md break-word">{nodeName}</span>
        </div>
    );
};

export default TemplatesName;
