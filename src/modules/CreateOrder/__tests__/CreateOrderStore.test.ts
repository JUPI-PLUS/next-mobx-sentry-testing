import { faker } from "@faker-js/faker";
import { MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { CreateOrderStore } from "../store";

const MOCKED_KIT_UUID = faker.datatype.uuid();

describe("CreateOrder store", () => {
    const createOrderStore = new CreateOrderStore();
    beforeEach(async () => {
        createOrderStore.cleanup();
    });

    it("Should set and cleanup", () => {
        createOrderStore.setupSelectedKit(MOCKED_KIT_UUID);
        createOrderStore.setupKitExamTemplates(MOCKED_KIT_UUID, MOCKED_EXAM_TEMPLATE_ARRAY);
        expect(createOrderStore.selectedKitsUUID.has(MOCKED_KIT_UUID)).toBeTruthy();
        createOrderStore.cleanup();
        expect(createOrderStore.selectedKitsUUID.size).toEqual(0);
        expect(createOrderStore.selectedKitExamTemplates.size).toEqual(0);
        expect(createOrderStore.isKitCached(MOCKED_KIT_UUID)).toBeFalsy();
    });

    it("Should cache kit", () => {
        createOrderStore.setupSelectedKit(MOCKED_KIT_UUID);
        createOrderStore.setupKitExamTemplates(MOCKED_KIT_UUID, MOCKED_EXAM_TEMPLATE_ARRAY);
        expect(createOrderStore.selectedKitExamTemplates.has(MOCKED_KIT_UUID)).toBeTruthy();
        createOrderStore.removeKit(MOCKED_KIT_UUID);
        expect(createOrderStore.selectedKitExamTemplates.has(MOCKED_KIT_UUID)).toBeFalsy();
        createOrderStore.setupSelectedKit(MOCKED_KIT_UUID);
        expect(createOrderStore.selectedKitExamTemplates.has(MOCKED_KIT_UUID)).toBeTruthy();
        expect(createOrderStore.isKitExamsCached(MOCKED_KIT_UUID)).toBeTruthy();
    });
});
