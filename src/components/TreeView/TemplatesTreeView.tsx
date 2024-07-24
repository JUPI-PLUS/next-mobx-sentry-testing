// libs
import { observer } from "mobx-react";

// stores
import { useTemplatesTreeViewStore } from "./TemplatesTreeViewStore";

// components
import TemplatesTreeList from "./components/TreeList/TemplatesTreeList";
import { getListOfTemplates } from "../../api/templates";
import { useQuery } from "react-query";
import { TEMPLATES_QUERY_KEYS } from "../../shared/constants/queryKeys";
import CircularProgressLoader from "../uiKit/CircularProgressLoader/CircularProgressLoader";

const TemplatesTreeView = () => {
    const { treeStructure, templatesFiltersQueryString, isNodePositionUpdating, setTreeView } =
        useTemplatesTreeViewStore();

    const { isFetching } = useQuery(
        TEMPLATES_QUERY_KEYS.LIST(templatesFiltersQueryString),
        // TODO: research how to handle it
        () => getListOfTemplates(templatesFiltersQueryString),
        {
            onSuccess: queryData => {
                setTreeView(queryData.data.data);
            },
        }
    );

    if (isFetching) return <CircularProgressLoader />;
    if (treeStructure.length === 0) return <div>No data</div>;

    return (
        <>
            <div
                className={`bg-white p-6 h-full overflow-hidden  ${
                    isNodePositionUpdating ? "rounded-t-lg" : "rounded-lg"
                }`}
            >
                <TemplatesTreeList list={treeStructure} containerClassName="h-full overflow-y-scroll pr-6" />
            </div>
        </>
    );
};

export default observer(TemplatesTreeView);
