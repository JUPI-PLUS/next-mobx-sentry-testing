// libs
import { faker } from "@faker-js/faker";
import { stringify } from "query-string";

// stores
import { TemplatesTreeViewStore } from "../TemplatesTreeViewStore";

// helpers
import { findLinkByPath } from "../utils";

// models
import { DialogTypeEnum, TemplatesTreeNode, TemplatesTypesEnum } from "../models";

// mocks
import {
    MOCK_TEMPLATES_TREE_NODE_ARRAY,
    MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD,
} from "../../../testingInfrustructure/mocks/treeView";
import { DEFAULT_TEMPLATES_FILTER_VALUES } from "../constants";

const getRandomNodeWithChild = (treeStructure: Array<TemplatesTreeNode>): TemplatesTreeNode => {
    return treeStructure.find(({ child }) => child)!;
};

const MOCK_NODE_DETAILS = {
    name: faker.random.alpha(5),
    path: faker.datatype.uuid(),
    type: 1,
    uuid: faker.datatype.uuid(),
};

describe.skip("deprecated TemplatesTreeViewStore", () => {
    const randomArrayLength = faker.datatype.number({
        min: 10,
        max: 50,
    });
    const store = new TemplatesTreeViewStore();
    it("Should correctly set and cleanup", () => {
        const randomNodePosition = faker.datatype.number({
            min: 0,
            max: randomArrayLength - 10,
        });
        const randomName = faker.random.alpha(5);
        const randomStatus = faker.datatype.number({
            min: 1,
            max: 3,
        });

        // create store
        expect(store).toBeTruthy();

        // check treeView
        store.setTreeView(MOCK_TEMPLATES_TREE_NODE_ARRAY(randomArrayLength));
        expect(store.treeStructure).toHaveLength(randomArrayLength);

        // check updatingNodePositionPath
        expect(store.updatingNodePositionPath).toBeNull();
        const randomNode = store.treeStructure[randomNodePosition];
        const randomNodeUuid = randomNode.uuid as string;
        store.copyPositionNodePath(randomNodeUuid);
        expect(store.updatingNodePositionPath).toEqual(randomNodeUuid);

        // check selectedNodes
        store.setSelectedNode(randomNodeUuid);
        expect(store.selectedNodesArray[0]).toEqual(randomNodeUuid);
        expect(store.selectedNodesArray).toEqual(expect.arrayContaining([randomNodeUuid]));
        store.removeSelectedNodes(randomNodeUuid);
        expect(store.selectedNodesArray).toHaveLength(0);

        // check Dialog
        store.setDialogType(DialogTypeEnum.ADD);
        store.setNodeDetails(MOCK_NODE_DETAILS);
        expect(store.dialogType).toEqual(DialogTypeEnum.ADD);
        expect(store.nodeDetails).toEqual(MOCK_NODE_DETAILS);
        store.onCloseDialog();
        expect(store.dialogType).toBeNull();
        expect(store.nodeDetails).toEqual({});

        // check Filter
        store.setTemplatesFilterValue("name", randomName);
        store.setTemplatesFilterValue("status", randomStatus);

        expect(store.templatesFilters).toEqual({
            name: randomName,
            status: randomStatus,
        });
        expect(store.templatesFiltersQueryString).toBe(
            stringify({
                name: randomName,
                status: randomStatus,
            })
        );

        store.resetTemplatesFilter();

        expect(store.templatesFilters).toEqual(DEFAULT_TEMPLATES_FILTER_VALUES);
        expect(store.templatesFiltersQueryString).toBe("");

        // cleanup store
        store.cleanup();
        expect(store.dialogType).toBeNull();
        expect(store.treeStructure).toHaveLength(0);
        expect(store.templatesFilters).toEqual(DEFAULT_TEMPLATES_FILTER_VALUES);
        expect(store.templatesFiltersQueryString).toBe("");
        expect(store.updatingNodePositionPath).toBeNull();
        expect(store.selectedNodesArray).toHaveLength(0);
    });

    it("Should add node to directory", () => {
        store.setTreeView(MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD(randomArrayLength));
        const randomDirWithChild = getRandomNodeWithChild(store.treeStructure) as TemplatesTreeNode;
        const randomDirWithChildUuid = randomDirWithChild.uuid as string;
        const randomChildNodes = MOCK_TEMPLATES_TREE_NODE_ARRAY();
        store.setTreeViewChildData(randomChildNodes, randomDirWithChildUuid);
        const foundLinkOfParent = findLinkByPath(store.treeStructure, randomDirWithChildUuid)!;
        expect(foundLinkOfParent.child).toEqual(randomChildNodes);
    });

    it("Should update node position in tree", () => {
        store.setTreeView(MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD(randomArrayLength));
        const randomNode = store.treeStructure.find(({ item_type }) => item_type !== TemplatesTypesEnum.GROUP)!;
        const randomNodeUuid = randomNode.uuid as string;
        store.copyPositionNodePath(randomNodeUuid);

        expect(store.updatingNodePositionPath).toEqual(randomNodeUuid);
        expect(store.isNodePositionUpdating).toBeTruthy();
        expect(store.updatingNodePositionType).toEqual(randomNode.item_type);

        const foundLinkOfNode = findLinkByPath(store.treeStructure, randomNodeUuid);

        expect(foundLinkOfNode).toEqual(randomNode);

        const insertPlace = getRandomNodeWithChild(store.treeStructure);

        store.setNodeDetails(insertPlace);

        expect(store.nodeDetails).toEqual(insertPlace);

        store.insertPositionNodePath();
        store.setNodeDetails({});

        const oldLinkOfNode = findLinkByPath(store.treeStructure, randomNodeUuid);
        expect(store.nodeDetails).toEqual({});
        expect(store.updatingNodePositionPath).toBeFalsy();
        expect(store.isNodePositionUpdating).toBeFalsy();
        expect(store.updatingNodePositionType).toBeFalsy();
        expect(oldLinkOfNode).toBeUndefined();
    });
});
