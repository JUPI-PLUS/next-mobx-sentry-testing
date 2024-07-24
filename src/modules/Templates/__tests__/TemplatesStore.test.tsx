import { faker } from "@faker-js/faker";
import { stringify } from "query-string";
import { ExamTemplateStatusesEnum } from "../../../shared/models/business/examTemplate";
import { TemplateTypeEnum } from "../../../shared/models/business/template";
import { MOCKED_TEMPLATE as GET_MOCKED_TEMPLATE } from "../../../testingInfrustructure/mocks/templates";
import { DialogTypeEnum } from "../models";
import { TemplatesStore } from "../store";

const MOCKED_UUID = faker.datatype.uuid();
const MOCKED_NESTED_LVL = faker.datatype.number();
const MOCKED_TEMPLATE = GET_MOCKED_TEMPLATE();
const MOCKED_TEMPLATE_WITH_PARENT_UUID = { ...GET_MOCKED_TEMPLATE(), parent_uuid: null };
const MOCKED_NAME_FILTER = faker.random.alpha(10);
const MOCKED_STATUS_FILTER = ExamTemplateStatusesEnum.ACTIVE;

describe("TemplatesStore", () => {
    const store = new TemplatesStore();

    it("Should setup copiedExamTemplateUUID and copiedKitTemplateUUID", () => {
        store.setupCopiedTemplate(TemplateTypeEnum.EXAM, MOCKED_UUID);
        expect(store.copiedExamTemplateUUID).toEqual(MOCKED_UUID);
        store.setupCopiedTemplate(TemplateTypeEnum.KIT, MOCKED_UUID);
        expect(store.copiedKitTemplateUUID).toEqual(MOCKED_UUID);
    });

    it("Should cleanup copiedExamTemplateUUID and copiedKitTemplateUUID", () => {
        store.cleanupExamTemplate();
        store.cleanupKitTemplate();

        expect(store.copiedExamTemplateUUID).toEqual("");
        expect(store.copiedKitTemplateUUID).toEqual("");
    });

    it("Should setup parentGroupUUID", () => {
        store.setupParentGroupUUID(MOCKED_UUID);
        expect(store.parentGroupUUID).toEqual(MOCKED_UUID);
    });
    it("Should setup nestedLvl", () => {
        store.setupNestedLvl(MOCKED_NESTED_LVL);
        expect(store.nestedLvl).toEqual(MOCKED_NESTED_LVL);
    });

    it("Should setup itemDetails", () => {
        store.setTemplateDetails(MOCKED_TEMPLATE);
        expect(store.itemDetails).toEqual(MOCKED_TEMPLATE);
    });

    it("Should setup cutItemDetails", () => {
        store.setUpdatingPositionTemplate(MOCKED_TEMPLATE_WITH_PARENT_UUID);
        expect(store.cutItemDetails).toEqual(MOCKED_TEMPLATE_WITH_PARENT_UUID);
    });

    it("Should setup dialogType", () => {
        store.setDialogType(DialogTypeEnum.ADD);
        expect(store.dialogType).toEqual(DialogTypeEnum.ADD);
    });

    it("Should cleanup dialogType and itemDetails, after call onCloseDialog", () => {
        store.onCloseDialog();
        expect(store.dialogType).toBeNull();
        expect(store.itemDetails).toEqual({});
    });

    it("Should change filters, after call setTemplatesFilterValue", () => {
        store.setTemplatesFilterValue("name", MOCKED_NAME_FILTER);
        store.setTemplatesFilterValue("status", MOCKED_STATUS_FILTER);

        expect(store.templatesFilters).toEqual({
            name: MOCKED_NAME_FILTER,
            status: MOCKED_STATUS_FILTER,
        });
        expect(store.templatesFiltersQueryString).toEqual(
            stringify(store.templatesFilters, { skipEmptyString: true, skipNull: true })
        );
    });

    it("Should return stringify query with groupUuid when filters is clear and groupUuid is exist", () => {
        expect(store.getTemplatesQuery()).toEqual(
            stringify(store.templatesFilters, { skipEmptyString: true, skipNull: true })
        );

        store.setupParentGroupUUID(MOCKED_UUID);
        store.setTemplatesFilterValue("name", "");
        store.setTemplatesFilterValue("status", null);
        expect(store.getTemplatesQuery()).toEqual(
            stringify({ group_uuid: MOCKED_UUID }, { skipEmptyString: true, skipNull: true })
        );
    });

    it("Should return stringify query with currentFolderUuid if currentFolderUuid is exist", () => {
        expect(store.templatesFolderQueryString).toEqual(
            stringify({ folder: null }, { skipEmptyString: true, skipNull: true })
        );

        store.setupCurrentFolderUUID(MOCKED_UUID);
        expect(store.templatesFolderQueryString).toEqual(
            stringify({ folder: MOCKED_UUID }, { skipEmptyString: true, skipNull: true })
        );
    });
});
