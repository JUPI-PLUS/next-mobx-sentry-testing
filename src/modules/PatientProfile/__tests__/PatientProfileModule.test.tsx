import React from "react";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import PatientProfileModule from "../PatientProfileModule";
import userEvent from "@testing-library/user-event";
import { getOrganizations, getPositions, getSexTypes, getUserRoles } from "../../../api/dictionaries";
import { details } from "../../../api/users";
import { MOCKED_PERMISSIONS_IDS, MOCK_USER, MOCK_DELETED_PATIENT } from "../../../testingInfrustructure/mocks/users";
import {
    MOCKED_ORGANIZATIONS,
    MOCKED_POSITIONS,
    MOCKED_SEX_TYPES,
    MOCKED_USER_ROLES,
} from "../../../testingInfrustructure/mocks/dictionaries";
import UserStore from "../../../shared/store/UserStore";
import { editUserProfile } from "../../../api/employee";
import { faker } from "@faker-js/faker";
import { format, fromUnixTime } from "date-fns";
import { DATE_FORMATS } from "../../../shared/constants/formates";
import { CurrentAccess } from "../../../shared/models/permissions";
import { tabsArr } from "../utils";
import { showWarningToast } from "../../../components/uiKit/Toast/helpers";
import { ROUTES } from "../../../shared/constants/routes";

const MOCKED_DETAILS_ADMIN = MOCK_USER({});
const MOCKED_DETAILS_WITHOUT_ROLE = MOCK_USER({ position_id: null, organization_id: null });
const MOCKED_EMPTY_PERMISSIONS: CurrentAccess = [];
const MOCKED_ALL_PERMISSIONS: CurrentAccess = MOCKED_PERMISSIONS_IDS;
const MOCKED_INPUT_VALUES = {
    firstName: faker.helpers.unique(faker.name.firstName),
    lastName: faker.helpers.unique(faker.name.lastName),
};

const MOCKED_GET_SEX_TYPES = mockFunction(getSexTypes);
const MOCKED_GET_USER_ROLES = mockFunction(getUserRoles);
const MOCKED_GET_ORGANIZATIONS = mockFunction(getOrganizations);
const MOCKED_GET_POSITIONS = mockFunction(getPositions);
const MOCKED_GET_DETAILS = mockFunction(details);
const MOCKED_GET_DETAILS_QUERY_REQUEST = jest.fn();
const MOCKED_PATCH_EDIT_USER_PROFILE = mockFunction(editUserProfile);
const MOCK_QUERY = jest.fn(() => ({ patientUUID: MOCKED_DETAILS_ADMIN.uuid }));
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_SHOW_WARNING_TOAST_MESSAGE = mockFunction(showWarningToast);

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useId: () => "",
}));
jest.mock("../../../api/config");
jest.mock("../../../api/users");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/employee");
jest.mock("../../../shared/hooks/useIsInViewport", () => jest.fn(() => false));
jest.mock("../../../components/uiKit/Toast/helpers");
jest.mock("../../../shared/hooks/useGetBase64Image", () => ({
    useGetBase64Image() {
        return {
            data: "stringOfBlobImage",
        };
    },
}));
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCK_QUERY(),
            replace: MOCK_ROUTER_REPLACE,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <PatientProfileModule />
        </QueryClientProvider>
    );
    return container;
};

describe("Patient profile module", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_GET_SEX_TYPES, { data: MOCKED_SEX_TYPES });
        resolveServerResponse(MOCKED_GET_USER_ROLES, { data: MOCKED_USER_ROLES });
        resolveServerResponse(MOCKED_GET_ORGANIZATIONS, { data: MOCKED_ORGANIZATIONS });
        resolveServerResponse(MOCKED_GET_POSITIONS, { data: MOCKED_POSITIONS });
        MOCKED_GET_DETAILS.mockReturnValue(MOCKED_GET_DETAILS_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render module without errors", async () => {
        UserStore.setUser(MOCKED_DETAILS_ADMIN);
        UserStore.setupPermissions(MOCKED_ALL_PERMISSIONS);
        MOCK_QUERY.mockReturnValue({ patientUUID: MOCKED_DETAILS_ADMIN.uuid });
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCKED_DETAILS_ADMIN });

        const status = false;

        await act(async () => {
            setup();
        });

        expect(screen.getByTestId(`${status}-avatar-status`)).toBeInTheDocument();
        expect(screen.getByTestId("patient-positions")).toHaveTextContent(
            MOCKED_POSITIONS.find(({ id }) => id === MOCKED_DETAILS_ADMIN.position_id)!.name
        );
    });

    it("Should redirect user to orders list page if patient is deleted", async () => {
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCK_DELETED_PATIENT });
        await act(async () => {
            setup();
        });
        expect(MOCKED_SHOW_WARNING_TOAST_MESSAGE).toHaveBeenCalled();
        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(ROUTES.orders.list.route);
    });

    it("Should render all tabs", async () => {
        UserStore.setUser(MOCKED_DETAILS_ADMIN);
        UserStore.setupPermissions(MOCKED_ALL_PERMISSIONS);
        MOCK_QUERY.mockReturnValue({ patientUUID: MOCKED_DETAILS_ADMIN.uuid });
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCKED_DETAILS_ADMIN });

        await act(async () => {
            setup();
        });

        tabsArr.forEach(({ label }) => {
            expect(screen.getByTestId(`tab-${label}-name`));
        });
    });

    describe("General info tab", () => {
        it("Should render component without errors", async () => {
            UserStore.setUser(MOCKED_DETAILS_ADMIN);
            UserStore.setupPermissions(MOCKED_ALL_PERMISSIONS);
            MOCK_QUERY.mockReturnValue({ patientUUID: MOCKED_DETAILS_ADMIN.uuid });
            resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCKED_DETAILS_ADMIN });

            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            const citizenshipSelectInput = renderResult!.querySelector(
                "#react-select-citizenship-input"
            ) as HTMLSelectElement;

            const preferredLanguageSelectInput = renderResult!.querySelector(
                "#react-select-preferred_language-input"
            ) as HTMLSelectElement;

            const contingentSelectInput = renderResult!.querySelector(
                "#react-select-contingent-input"
            ) as HTMLSelectElement;

            expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();

            expect(screen.getByTestId("patient-first-name")).toHaveDisplayValue(MOCKED_DETAILS_ADMIN.first_name!);
            expect(screen.getByTestId("patient-first-name")).not.toBeDisabled();

            expect(screen.getByTestId("patient-last-name")).toHaveDisplayValue(MOCKED_DETAILS_ADMIN.last_name!);
            expect(screen.getByTestId("patient-last-name")).not.toBeDisabled();

            expect(screen.getByTestId("patient-middle-name")).toBeInTheDocument();
            // expect(screen.getByTestId("patient-middle-name")).not.toBeDisabled();

            expect(screen.getByTestId("datepicker-input")).toHaveDisplayValue(
                format(fromUnixTime(MOCKED_DETAILS_WITHOUT_ROLE.birth_date!), DATE_FORMATS.DATE_ONLY)
            );
            expect(screen.getByTestId("datepicker-input")).not.toBeDisabled();

            expect(screen.getByTestId("electronic-health-card")).toBeInTheDocument();
            // expect(screen.getByTestId("electronic-health-card")).not.toBeDisabled();

            expect(citizenshipSelectInput).toBeInTheDocument();
            // expect(citizenshipSelectInput).not.toBeDisabled();

            expect(preferredLanguageSelectInput).toBeInTheDocument();
            // expect(preferredLanguageSelectInput).not.toBeDisabled();

            expect(contingentSelectInput).toBeInTheDocument();
            // expect(contingentSelectInput).not.toBeDisabled();

            expect(screen.getByTestId("notes")).toBeInTheDocument();
            // expect(screen.getByTestId("notes")).not.toBeDisabled();
        });

        it("Should render component with none user role", async () => {
            UserStore.setUser(MOCKED_DETAILS_WITHOUT_ROLE);
            UserStore.setupPermissions(MOCKED_EMPTY_PERMISSIONS);
            MOCK_QUERY.mockReturnValue({ patientUUID: MOCKED_DETAILS_WITHOUT_ROLE.uuid });
            resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCKED_DETAILS_WITHOUT_ROLE });

            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            const citizenshipSelectInput = renderResult!.querySelector(
                "#react-select-citizenship-input"
            ) as HTMLSelectElement;

            const preferredLanguageSelectInput = renderResult!.querySelector(
                "#react-select-preferred_language-input"
            ) as HTMLSelectElement;

            const contingentSelectInput = renderResult!.querySelector(
                "#react-select-contingent-input"
            ) as HTMLSelectElement;

            expect(screen.getByTestId("patient-first-name")).toBeDisabled();
            expect(screen.getByTestId("patient-last-name")).toBeDisabled();
            expect(screen.getByTestId("patient-middle-name")).toBeDisabled();
            expect(screen.getByTestId("electronic-health-card")).toBeDisabled();
            expect(citizenshipSelectInput).toBeDisabled();
            expect(preferredLanguageSelectInput).toBeDisabled();
            expect(contingentSelectInput).toBeDisabled();
            expect(screen.getByTestId("notes")).toBeDisabled();
        });

        it("Should save patient changes by admin", async () => {
            UserStore.setUser(MOCKED_DETAILS_ADMIN);
            UserStore.setupPermissions(MOCKED_ALL_PERMISSIONS);
            MOCK_QUERY.mockReturnValue({ patientUUID: MOCKED_DETAILS_ADMIN.uuid });
            resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCKED_DETAILS_ADMIN });

            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("patient-first-name"));
                userEvent.paste(screen.getByTestId("patient-first-name"), MOCKED_INPUT_VALUES.firstName);
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("patient-last-name"));
                userEvent.paste(screen.getByTestId("patient-last-name"), MOCKED_INPUT_VALUES.lastName);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("edit-user-info-button"));
            });

            expect(MOCKED_PATCH_EDIT_USER_PROFILE).toHaveBeenCalledWith({
                id: MOCKED_DETAILS_ADMIN.uuid,
                editProfileFormFields: {
                    birth_date: MOCKED_DETAILS_ADMIN.birth_date,
                    sex_id: MOCKED_DETAILS_ADMIN.sex_id,
                    first_name: MOCKED_INPUT_VALUES.firstName,
                    last_name: MOCKED_INPUT_VALUES.lastName,
                    // @ts-ignore
                    middle_name: MOCKED_INPUT_VALUES.middleName,
                    // @ts-ignore
                    notes: MOCKED_INPUT_VALUES.notes,
                    // @ts-ignore
                    preferred_language: MOCKED_INPUT_VALUES.preferredLanguage,
                    // @ts-ignore
                    citizenship: MOCKED_INPUT_VALUES.citizenship,
                    // @ts-ignore
                    contingent: MOCKED_INPUT_VALUES.contingent,
                    // @ts-ignore
                    electronic_health_card: MOCKED_INPUT_VALUES.electronicHealthCard,
                    status: false,
                },
            });
        });
    });
});
