import { MOCK_USER } from "../../../testingInfrustructure/mocks/users";
import {
    MOCKED_ORGANIZATIONS,
    MOCKED_SEX_TYPES,
} from "../../../testingInfrustructure/mocks/dictionaries";
import { toLookupList } from "../../../shared/utils/lookups";
import { PatientStore } from "../store";

const MOCKED_DETAILS_ADMIN = MOCK_USER({});
const MOCKED_SEX_TYPES_LOOKUP = toLookupList(MOCKED_SEX_TYPES);
const MOCKED_ORGANIZATIONS_LOOKUP = toLookupList(MOCKED_ORGANIZATIONS);

describe("PatientProfile store", () => {
    const patientStore = new PatientStore();
    beforeEach(async () => {
        patientStore.cleanup();
    });

    it("Should set and cleanup", () => {
        patientStore.setPatient(MOCKED_DETAILS_ADMIN);
        patientStore.setupSexTypes(MOCKED_SEX_TYPES_LOOKUP);
        patientStore.setupOrganizations(MOCKED_ORGANIZATIONS_LOOKUP);
        expect(patientStore.patient).toEqual(MOCKED_DETAILS_ADMIN);
        patientStore.cleanup();
        expect(patientStore.sexTypes).toEqual(MOCKED_SEX_TYPES_LOOKUP);
        expect(patientStore.organizations).toEqual(MOCKED_ORGANIZATIONS_LOOKUP);
        expect(patientStore.patient).toEqual(null);
    });

    it("Should return correct patient data", () => {
        expect(patientStore.email).toEqual("");
        expect(patientStore.name).toEqual("");
        expect(patientStore.avatar).toEqual("");
        expect(patientStore.additionalInformation).toEqual({
            organization_id: null,
            position_id: null,
        });
        patientStore.setPatient(MOCKED_DETAILS_ADMIN);
        expect(patientStore.email).toEqual(MOCKED_DETAILS_ADMIN.email);
        expect(patientStore.name).toEqual(`${MOCKED_DETAILS_ADMIN.first_name} ${MOCKED_DETAILS_ADMIN.last_name}`);
        expect(patientStore.avatar).toEqual(MOCKED_DETAILS_ADMIN.profile_photo);
        expect(patientStore.additionalInformation).toEqual({
            organization_id: MOCKED_DETAILS_ADMIN.organization_id,
            position_id: MOCKED_DETAILS_ADMIN.position_id,
        });
    });
});
