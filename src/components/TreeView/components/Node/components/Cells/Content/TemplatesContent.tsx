// libs
import { FC } from "react";

// models
import { TemplatesTreeNodeContentProps, TemplatesTypesEnum } from "../../../../../models";

// components
import Status from "../../Status/Status";

const TemplatesContent: FC<TemplatesTreeNodeContentProps> = ({ type, code, status }) => {
    if (type === TemplatesTypesEnum.GROUP || (!code && !status)) return null;

    return (
        <div className="w-full ml-3 items-center grid grid-cols-2">
            {code && <div>{code}</div>}
            {status && <Status type={type} status={status} />}
        </div>
    );
};

export default TemplatesContent;
