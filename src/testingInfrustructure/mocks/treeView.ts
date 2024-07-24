// libs
import { faker } from "@faker-js/faker";

// models
import { Template, TemplatesTreeNode, TemplatesTypesEnum } from "../../components/TreeView/models";
import { ExamTemplateStatusesEnum } from "../../shared/models/business/examTemplate";

export const MOCK_TEMPLATES_TREE_NODE = ({
    has_child = false,
    item_type = TemplatesTypesEnum.GROUP,
    status = ExamTemplateStatusesEnum.ACTIVE,
}: Partial<Template>): TemplatesTreeNode => {
    return {
        uuid: faker.datatype.uuid(),
        name: faker.random.alpha(20),
        has_child,
        item_type,
        code: faker.random.alpha(10),
        status: item_type === TemplatesTypesEnum.GROUP ? null : status,
        child: has_child ? [] : undefined,
    };
};

export const MOCK_TEMPLATES_TREE_NODE_WITH_CHILD = (): TemplatesTreeNode => {
    return {
        uuid: faker.datatype.uuid(),
        name: faker.random.alpha(20),
        has_child: true,
        item_type: TemplatesTypesEnum.GROUP,
        code: faker.random.alpha(10),
        status: 1,
        child: [],
    };
};

export const MOCK_TEMPLATES_TREE_NODE_WITHOUT_CHILD = (): TemplatesTreeNode => {
    return {
        uuid: faker.datatype.uuid(),
        name: faker.random.alpha(20),
        has_child: false,
        item_type: TemplatesTypesEnum.GROUP,
        code: faker.random.alpha(10),
        status: 1,
        child: undefined,
    };
};

export const MOCK_TEMPLATES_TREE_NODE_ARRAY = (arrayLength = 5): Array<TemplatesTreeNode> => {
    const treeNodeArray = [];
    // TODO: refactor this function
    for (let i = 0; i < arrayLength; i++) {
        if (i <= 3) {
            treeNodeArray.push(MOCK_TEMPLATES_TREE_NODE({ item_type: i }));
        } else {
            const randomNumber = faker.datatype.number({
                min: 0,
                max: 10,
            });
            const hasChild = randomNumber <= 5;
            treeNodeArray.push(
                MOCK_TEMPLATES_TREE_NODE({
                    has_child: hasChild,
                    item_type: hasChild ? TemplatesTypesEnum.GROUP : TemplatesTypesEnum.EXAM,
                })
            );
        }
    }
    return treeNodeArray;
};

export const MOCK_TEMPLATES_TREE_NODE_ARRAY_WITH_CHILD = (arrayLength = 5): Array<TemplatesTreeNode> => {
    const treeNodeArray = MOCK_TEMPLATES_TREE_NODE_ARRAY(arrayLength);
    treeNodeArray.push(MOCK_TEMPLATES_TREE_NODE_WITH_CHILD());
    return treeNodeArray;
};
