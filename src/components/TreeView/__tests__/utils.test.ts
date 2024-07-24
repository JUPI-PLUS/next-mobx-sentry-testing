// libs
import { faker } from "@faker-js/faker";

// mocks
import { MOCK_TEMPLATES_TREE_NODE, MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD } from "../../../testingInfrustructure/mocks/treeView";

// helpers
import { cutByPath, deleteByPath, findLinkByPath } from "../utils";

describe("TreeView helper", () => {
    const randomArrayLength = faker.datatype.number({
        min: 10,
        max: 50,
    });
    const randomTreeNodeArray = MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD(randomArrayLength);
    const parentNodeWithNullChild = randomTreeNodeArray.find(item => item.child)!;
    const finalNode = MOCK_TEMPLATES_TREE_NODE({});
    it("findLinkByPath should find and return link of object", () => {
        parentNodeWithNullChild.child = [finalNode];
        const foundLink = findLinkByPath(randomTreeNodeArray, parentNodeWithNullChild.uuid + "." + finalNode.uuid);
        expect(finalNode).toEqual(foundLink);
    });
    it("deleteByPath should delete link in object by path", () => {
        parentNodeWithNullChild.child = [finalNode];
        deleteByPath(randomTreeNodeArray, parentNodeWithNullChild.uuid + "." + finalNode.uuid);
        expect(parentNodeWithNullChild.child?.some(({ uuid }) => uuid === finalNode.uuid)).toBeFalsy();
    });
    it("cutByPath should cut link in object by path", () => {
        parentNodeWithNullChild.child = [finalNode];
        const cuteNode = cutByPath(randomTreeNodeArray, parentNodeWithNullChild.uuid + "." + finalNode.uuid);
        expect(parentNodeWithNullChild.child?.some(({ uuid }) => uuid === finalNode.uuid)).toBeFalsy();
        expect(cuteNode).toEqual(finalNode);
    });
});
