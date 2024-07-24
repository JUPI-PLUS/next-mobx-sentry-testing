// libs
import { FC, useCallback, useEffect, useState } from "react";
import { stringify } from "query-string";
import { useMutation } from "react-query";
import { observer } from "mobx-react";

// store
import { useTemplatesTreeViewStore } from "../../TemplatesTreeViewStore";

// api
import { getListOfTemplates } from "../../../../api/templates";

// helpers
import { getNestedLvlByPath } from "../../utils";

// models
import { TemplatesTreeNodeProps, TemplatesTypesEnum } from "../../models";

// components
import TemplatesContent from "./components/Cells/Content/TemplatesContent";
import TemplatesName from "./components/Cells/Name/TemplatesName";
import TemplatesActions from "./components/Cells/Actions/TemplatesActions";
import TemplatesTreeList from "../TreeList/TemplatesTreeList";

const TemplatesNode: FC<TemplatesTreeNodeProps> = ({ parentPath, node }) => {
    const { setTreeViewChildData } = useTemplatesTreeViewStore();
    const [childVisible, setChildVisible] = useState(false);

    const { uuid, name, item_type: type, child } = node;
    const hasChild = Boolean(child);
    const fullPath = `${parentPath ? parentPath + "." : ""}${uuid}`;

    const { mutateAsync: getDirData, isLoading } = useMutation(getListOfTemplates, {
        onSuccess(dirData) {
            setTreeViewChildData(dirData.data.data, fullPath);
        },
    });

    useEffect(() => {
        if (child && child.length === 0) {
            setChildVisible(false);
        }
    }, [child?.length]);

    const onIconClickHandler = useCallback(async () => {
        if (isLoading || !hasChild) return;
        if (child?.length === 0) {
            try {
                const queryFilters = stringify({ group_uuid: uuid });
                await getDirData(queryFilters);
            } catch (error) {}
        }
        setChildVisible(isVisible => !isVisible);
    }, [isLoading, hasChild, child?.length, uuid, getDirData]);

    return (
        <li className={parentPath ? "ml-8" : ""} data-testid={fullPath}>
            <div className={"flex border rounded-md px-3 py-2 mb-1 relative group border-dark-400"}>
                <TemplatesName
                    type={type}
                    isLoading={isLoading}
                    childVisible={childVisible}
                    nodeName={name}
                    fullPath={fullPath}
                    hasChild={hasChild}
                    onIconClickHandler={onIconClickHandler}
                />
                <TemplatesContent type={type} code={node.code} status={node.status} />
                <TemplatesActions
                    type={type}
                    nestedLvl={getNestedLvlByPath(fullPath)}
                    deleteAllowed={type === TemplatesTypesEnum.GROUP ? !hasChild : true}
                    name={name}
                    fullPath={fullPath}
                    parentPath={parentPath}
                    uuid={uuid as string}
                    getDirData={getDirData}
                />
            </div>
            {child && child.length > 0 && childVisible && <TemplatesTreeList parentPath={fullPath} list={child} />}
        </li>
    );
};

export default observer(TemplatesNode);
