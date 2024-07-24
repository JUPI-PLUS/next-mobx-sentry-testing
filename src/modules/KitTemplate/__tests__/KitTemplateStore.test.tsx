// stores
import { KitTemplateStore } from "../store";

// helpers
import { toLookupList } from "../../../shared/utils/lookups";

// mocks
import { MOCKED_EXAM_TEMPLATE_ERROR, MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { MOCKED_KIT_TEMPLATE_STATUSES } from "../../../testingInfrustructure/mocks/kits";
import { MOCKED_UUID } from "./KitTemplateModule.test";

const MOCKED_ONE_EXAM_TEMPLATE_ARRAY = [MOCKED_EXAM_TEMPLATE_ARRAY[0]];

describe("KitTemplateStore", () => {
    const store = new KitTemplateStore();

    it("Should check entire store and throw no errors", () => {
        // checks if store is initialized
        expect(store).toBeTruthy();

        // checks if 'setupSelectedExamTemplates' works and updated 'selectedExamTemplates' & 'selectedExamTemplatesUUIDs'
        store.addSelectedExamTemplates(MOCKED_ONE_EXAM_TEMPLATE_ARRAY);
        expect(store.selectedExamTemplates).toEqual(MOCKED_ONE_EXAM_TEMPLATE_ARRAY);

        // checks if 'removeExamTemplate' works and clears 'selectedExamTemplates' & 'selectedExamTemplatesUUIDs'
        store.removeExamTemplate(0);
        expect(store.selectedExamTemplates).toEqual([]);

        // checks if 'setupCurrentKitTemplateUUID' works and sets 'currentKitTemplateUUID'
        store.setupCurrentKitTemplateUUID(MOCKED_UUID);
        expect(store.currentKitTemplateUUID).toBe(MOCKED_UUID);

        // checks if 'isEditPage' is true as far as it has MOCKED_UUID set
        const isEdit = store.isEditPage;
        expect(isEdit).toBeTruthy();

        // checks if 'setupKitTemplateStatuses' works and sets 'kitTemplateStatuses'
        store.setupKitTemplateStatusesLookup(toLookupList(MOCKED_KIT_TEMPLATE_STATUSES));
        expect(store.kitTemplateStatusesLookup).toEqual(toLookupList(MOCKED_KIT_TEMPLATE_STATUSES));

        // checks if 'setupExamTemplateErrors' works and sets 'errors'
        const firstFieldMessage = MOCKED_EXAM_TEMPLATE_ERROR.message[0];
        const errors = [null, firstFieldMessage, null];
        store.setupExamTemplateErrors(errors);
        expect(store.examTemplateErrors).toEqual(errors);

        // checks if 'removeExamTemplateErrors' works and sets 'errors'
        store.removeExamTemplateErrors(1);
        expect(store.examTemplateErrors).toEqual([null, null]);

        // checks if 'cleanup' works and removes all exam templates from the store
        store.addSelectedExamTemplates(MOCKED_ONE_EXAM_TEMPLATE_ARRAY);
        expect(store.selectedExamTemplates).toEqual(MOCKED_ONE_EXAM_TEMPLATE_ARRAY);
        store.cleanup();
        expect(store.selectedExamTemplates).toEqual([]);
    });
});
