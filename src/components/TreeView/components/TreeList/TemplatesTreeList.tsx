// libs
import { FC } from "react";
import { observer } from "mobx-react";

// models
import { TemplatesTreeListProps } from "../../models";

// components
import TemplatesNode from "../Node/TemplatesNode";

const TemplatesTreeList: FC<TemplatesTreeListProps> = ({ parentPath = "", containerClassName = "", list }) => {
    return (
        <ul className={containerClassName}>
            {list.map(node => (
                <TemplatesNode parentPath={parentPath} key={node.uuid} node={node} />
            ))}
        </ul>
    );
};

export default observer(TemplatesTreeList);
