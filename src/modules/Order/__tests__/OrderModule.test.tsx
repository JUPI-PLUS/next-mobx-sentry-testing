// libs
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { format, fromUnixTime } from "date-fns";

// helpers
import { getOrderDetails, getOrderExamsList } from "../../../api/orders";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { details } from "../../../api/users";
import { addOffsetToUtcDate } from "../../../shared/utils/date";
import { getExamStatuses, getSampleTypes } from "../../../api/dictionaries";
import { detachExamsFromSample, patchSampleMarkAsDamaged } from "../../../api/samples";
import { getDamageTypesLookup } from "../../../api/lookups";

// mocks
import { MOCKED_ORDER } from "../../../testingInfrustructure/mocks/order";
import { MOCKED_PERMISSIONS_IDS, MOCK_USER, MOCK_DELETED_PATIENT } from "../../../testingInfrustructure/mocks/users";
import { MOCKED_ORDER_EXAM, MOCKED_ORDER_EXAMS_LIST } from "../../../testingInfrustructure/mocks/orders";
import {
    MOCKED_DAMAGE_REASONS,
    MOCKED_EXAM_STATUSES,
    MOCKED_SAMPLE_TYPES,
} from "../../../testingInfrustructure/mocks/dictionaries";

// stores
import UserStore from "../../../shared/store/UserStore";

// constants
import { DATE_FORMATS } from "../../../shared/constants/formates";

// models
import { OrderStatus } from "../../../shared/models/business/order";
import { ExamStatusesEnum } from "../../../shared/models/business/exam";

// components
import OrderModule from "../OrderModule";

const MOCK_ROUTER_PUSH = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_GET_ORDER_DETAILS_REQUEST = jest.fn();
const MOCKED_GET_ORDER_DETAILS = mockFunction(getOrderDetails).mockImplementation(
    () => MOCKED_GET_ORDER_DETAILS_REQUEST
);
const MOCKED_GET_ORDER_EXAM_LIST_REQUEST = jest.fn();
const MOCKED_GET_ORDER_EXAM_LIST = mockFunction(getOrderExamsList);
const MOCKED_DETACH_EXAMS_FROM_SAMPLE = mockFunction(detachExamsFromSample);
const MOCKED_PATCH_SAMPLE_MARK_AS_DAMAGED = mockFunction(patchSampleMarkAsDamaged);
const MOCKED_GET_USER_DETAILS = mockFunction(details);
const MOCKED_GET_USER_DETAILS_REQUEST = jest.fn();
const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_EXAM_STATUSES = mockFunction(getExamStatuses);
const MOCKED_GET_DAMAGE_TYPES_LOOKUP = mockFunction(getDamageTypesLookup);
const MOCKED_ORDER_USER = MOCK_USER({});
const MOCKED_IN_PROGRESS_ORDER = MOCKED_ORDER({ status: OrderStatus.IN_PROGRESS });
const MOCKED_ORDER_BIOMATERIAL_RECEIVED = MOCKED_ORDER_EXAM({
    exam_status: ExamStatusesEnum.BIOMATERIAL_RECEIVED,
    sample_type: 1,
});
const MOCKED_ORDER_UUID = faker.datatype.uuid();

jest.mock("../../../api/users");
jest.mock("../../../api/lookups");
jest.mock("../../../api/config");
jest.mock("../../../api/orders");
jest.mock("../../../api/samples");
jest.mock("../../../api/dictionaries");
jest.spyOn(React, "useId").mockImplementation(() => "");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "",
            asPath: "",
            query: { uuid: MOCKED_ORDER_UUID },
            push: MOCK_ROUTER_PUSH,
            replace: MOCK_ROUTER_REPLACE,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <OrderModule />
        </QueryClientProvider>
    );
    return container;
};

const getOrderStatus = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.IN_PROGRESS:
            return "In progress";
        case OrderStatus.BIOMATERIALS_RECEIVED:
            return "BiomaterialTypeCell received";
        case OrderStatus.FAILED:
            return "Failed";
        case OrderStatus.DONE:
            return "Done";
        case OrderStatus.PRE_ORDER:
            return "Preorder";
        case OrderStatus.NEW:
        default:
            return "";
    }
};

describe("Order module", () => {
    beforeAll(() => {
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        resolveServerResponse(MOCKED_GET_ORDER_DETAILS_REQUEST, { data: MOCKED_IN_PROGRESS_ORDER });
        MOCKED_GET_USER_DETAILS.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_USER_DETAILS_REQUEST, {
                data: MOCKED_ORDER_USER,
            })
        );
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES });
        resolveServerResponse(MOCKED_GET_EXAM_STATUSES, { data: MOCKED_EXAM_STATUSES });
        resolveServerResponse(MOCKED_GET_DAMAGE_TYPES_LOOKUP, { data: MOCKED_DAMAGE_REASONS });
    });

    it("Should render component without errors", async () => {
        MOCKED_GET_ORDER_EXAM_LIST.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_ORDER_EXAM_LIST_REQUEST, {
                data: MOCKED_ORDER_EXAMS_LIST,
                total: MOCKED_ORDER_EXAMS_LIST.length,
            })
        );

        await act(async () => {
            setup();
        });

        expect(MOCKED_GET_ORDER_DETAILS).toBeCalledWith(MOCKED_ORDER_UUID);
        expect(MOCKED_GET_USER_DETAILS).toBeCalledWith(MOCKED_IN_PROGRESS_ORDER.user_uuid);

        expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent(
            `Order ${MOCKED_IN_PROGRESS_ORDER.order_number}`
        );
        expect(screen.getByTestId("user-full-name")).toHaveTextContent(
            `${MOCKED_ORDER_USER.first_name} ${MOCKED_ORDER_USER.last_name}`
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(MOCKED_ORDER_USER.email!);
        expect(screen.getByTestId("user-birthdate")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCKED_ORDER_USER.birth_date ?? 0)), DATE_FORMATS.DATE_ONLY)
        );
        expect(screen.getByTestId("user-barcode")).toHaveTextContent(MOCKED_ORDER_USER.barcode);

        expect(screen.getByTestId("order-information-referral-doctor")).toHaveTextContent(
            MOCKED_IN_PROGRESS_ORDER.referral_doctor
        );
        expect(screen.getByTestId("order-information-order-status")).toHaveTextContent(
            getOrderStatus(MOCKED_IN_PROGRESS_ORDER.status)
        );
        expect(screen.getByTestId("order-information-creation-date")).toHaveTextContent(
            format(
                addOffsetToUtcDate(fromUnixTime(MOCKED_IN_PROGRESS_ORDER.created_at_timestamp)),
                DATE_FORMATS.DATE_ONLY
            )
        );
        expect(screen.getByTestId("order-information-referral-notes")).toHaveTextContent(
            MOCKED_IN_PROGRESS_ORDER.referral_notes
        );
    });

    it("Should remove sample from exams", async () => {
        MOCKED_GET_ORDER_EXAM_LIST.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_ORDER_EXAM_LIST_REQUEST, {
                data: [MOCKED_ORDER_BIOMATERIAL_RECEIVED],
                total: 1,
            })
        );

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`exam-checkbox-${MOCKED_ORDER_BIOMATERIAL_RECEIVED.exam_uuid}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("sample-remove-item"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DETACH_EXAMS_FROM_SAMPLE).toHaveBeenCalled();
    });

    it.skip("Should mark sample as damaged", async () => {
        MOCKED_GET_ORDER_EXAM_LIST.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_ORDER_EXAM_LIST_REQUEST, {
                data: [MOCKED_ORDER_BIOMATERIAL_RECEIVED],
                total: 1,
            })
        );

        let renderResult: HTMLElement;
        await act(async () => {
            renderResult = setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`exam-checkbox-${MOCKED_ORDER_BIOMATERIAL_RECEIVED.exam_uuid}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("sample-mark-as-damaged-item"));
        });

        const damageReasonSelectInput = renderResult!.querySelector(
            "#react-select-damage_reason-input"
        ) as HTMLSelectElement;

        await act(async () => {
            userEvent.click(damageReasonSelectInput);
        });

        await act(async () => {
            userEvent.click(renderResult!.querySelector("#react-select-damage_reason-option-0")!);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-drawer-button"));
        });

        expect(MOCKED_PATCH_SAMPLE_MARK_AS_DAMAGED).toHaveBeenCalled();
    });

    it("Should not show view profile button and download order results button if user is deleted", async () => {
        MOCKED_GET_USER_DETAILS.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_USER_DETAILS_REQUEST, {
                data: MOCK_DELETED_PATIENT,
            })
        );
        await act(async () => {
            setup();
        });

        expect(screen.queryByTestId("view-profile-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("download-order-button")).not.toBeInTheDocument();
    });
});
