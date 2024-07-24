// libs
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

// api
import { getPhoneTypes } from "../../../../../api/dictionaries";
import { createPhone, editPhone } from "../../../../../api/phones";

// helpers
import { mockFunction, rejectServerResponse, resolveServerResponse } from "../../../../../testingInfrustructure/utils";

// models
import { PhoneContact } from "../../../../../shared/models/phones";

// constants
import { ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID, DEFAULT_PHONE_TYPE_ID } from "../constants";

// components
import { showSuccessToast } from "../../../../uiKit/Toast/helpers";
import PhoneContactDrawer from "../PhoneContactDrawer";

// mocks
import { MOCK_PATIENT } from "../../../../../testingInfrustructure/mocks/users";
import { MOCKED_PHONE_TYPES } from "../../../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_USER_PHONE } from "../../../../../testingInfrustructure/mocks/contacts";

jest.mock("../../../../../api/dictionaries");
jest.mock("../../../../../api/phones");
jest.mock("../../../../../components/uiKit/Toast/helpers");

const MOCKED_PHONE_TYPES_REQUEST = mockFunction(getPhoneTypes);
const MOCKED_CREATE_PHONE = mockFunction(createPhone);
const MOCKED_EDIT_PHONE = mockFunction(editPhone);
const MOCKED_EDIT_PHONE_QUERY_REQUEST = jest.fn();

const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);

const MOCKED_ON_CLOSE = jest.fn();
const MOCKED_ON_REFETCH = jest.fn();

const MOCKED_PHONE = MOCKED_USER_PHONE();
const MOCKED_PHONE_NOT_VERIFIED = MOCKED_USER_PHONE({ verified_at: null });

const mockedPhone = "+380665999888";
const mockedPhoneInvalid = faker.random.numeric(5);

const setup = (contact: PhoneContact | null = null) => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <PhoneContactDrawer
                isOpen={true}
                contact={contact}
                onRefetchData={MOCKED_ON_REFETCH}
                onClose={MOCKED_ON_CLOSE}
                userUUID={MOCK_PATIENT.uuid}
            />
        </QueryClientProvider>
    );
    return container;
};

describe("PhoneContactDrawer component", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_PHONE_TYPES_REQUEST, { data: MOCKED_PHONE_TYPES });

        resolveServerResponse(MOCKED_CREATE_PHONE, {});

        resolveServerResponse(MOCKED_EDIT_PHONE_QUERY_REQUEST, {});
        MOCKED_EDIT_PHONE.mockReturnValue(MOCKED_EDIT_PHONE_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Add phone number", () => {
        it("Should render component without errors", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add phone number");
            const typeIdInputValue = renderResult!.querySelector('[name="type_id"]') as HTMLSelectElement;
            expect(typeIdInputValue).toHaveValue(String(DEFAULT_PHONE_TYPE_ID));
            expect(screen.getByTestId("contact-phone-input")).toHaveValue("+49 ");
        });

        it("Should call createPhone request", async () => {
            await act(async () => {
                setup();
            });

            await fillForm(mockedPhone, MOCKED_PHONE_TYPES[1].name);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_PHONE).toHaveBeenCalledWith({
                user_uuid: MOCK_PATIENT.uuid,
                type_id: MOCKED_PHONE_TYPES[1].id,
                number: mockedPhone,
            });
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).toHaveBeenCalled();
        });

        it("Should not call createPhone request and show error message if phone number is invalid", async () => {
            await act(async () => {
                setup();
            });

            await fillForm(mockedPhoneInvalid);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_PHONE).not.toHaveBeenCalled();
            expect(screen.getByText("Please, enter a valid phone number")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).not.toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should call createPhone request and show error message if phone number already exists", async () => {
            rejectServerResponse(MOCKED_CREATE_PHONE, {
                response: {
                    data: {
                        errors: [
                            {
                                field: "number",
                                message: ["The phone number is already associated."],
                                messageLocaliseId: [ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID],
                            },
                        ],
                    },
                },
            });

            await act(async () => {
                setup();
            });

            await fillForm(mockedPhone);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_PHONE).toHaveBeenCalledWith({
                user_uuid: MOCK_PATIENT.uuid,
                type_id: DEFAULT_PHONE_TYPE_ID,
                number: mockedPhone,
            });
            expect(screen.getByText("The phone number is already associated.")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });
    });

    describe("Edit phone number", () => {
        it("Should render component without errors", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup(MOCKED_PHONE_NOT_VERIFIED);
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Edit phone number");
            const typeIdInputValue = renderResult!.querySelector('[name="type_id"]') as HTMLSelectElement;
            expect(typeIdInputValue).toHaveValue(String(MOCKED_PHONE_NOT_VERIFIED.type_id));
            expect(screen.getByTestId("contact-phone-input")).toHaveValue(MOCKED_PHONE_NOT_VERIFIED.number);
        });

        it("Should call editPhone request", async () => {
            await act(async () => {
                setup(MOCKED_PHONE_NOT_VERIFIED);
            });

            await fillForm(mockedPhone, MOCKED_PHONE_TYPES[1].name);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_PHONE).toHaveBeenCalledWith(MOCKED_PHONE_NOT_VERIFIED.uuid);
            expect(MOCKED_EDIT_PHONE_QUERY_REQUEST).toHaveBeenCalledWith({
                type_id: MOCKED_PHONE_TYPES[1].id,
                number: mockedPhone,
            });
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).toHaveBeenCalled();
        });

        it("Should not call editPhone request and show error message if phone number is invalid", async () => {
            await act(async () => {
                setup(MOCKED_PHONE_NOT_VERIFIED);
            });

            await fillForm(mockedPhoneInvalid);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_PHONE_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(screen.getByText("Please, enter a valid phone number")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).not.toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should call createPhone request and show error message if phone number already exists", async () => {
            rejectServerResponse(MOCKED_EDIT_PHONE_QUERY_REQUEST, {
                response: {
                    data: {
                        errors: [
                            {
                                field: "number",
                                message: ["The phone number is already associated."],
                                messageLocaliseId: [ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID],
                            },
                        ],
                    },
                },
            });

            await act(async () => {
                setup(MOCKED_PHONE_NOT_VERIFIED);
            });

            await fillForm(mockedPhone);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_PHONE).toHaveBeenCalledWith(MOCKED_PHONE_NOT_VERIFIED.uuid);
            expect(MOCKED_EDIT_PHONE_QUERY_REQUEST).toHaveBeenCalledWith({
                type_id: MOCKED_PHONE_NOT_VERIFIED.type_id,
                number: mockedPhone,
            });
            expect(screen.getByText("The phone number is already associated.")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should open drawer with disabled phone field if phone is verified", async () => {
            await act(async () => {
                setup(MOCKED_PHONE);
            });

            expect(screen.queryByTestId("contact-phone-input")).toBeDisabled();
        });
    });
});

const fillForm = async (phone: string, typeId?: string) => {
    if (typeId) {
        await act(async () => {
            userEvent.click(screen.queryAllByRole("combobox")[0]);
        });
        await act(async () => {
            userEvent.click(screen.getByText(typeId));
        });
    }
    await act(async () => {
        userEvent.clear(screen.getByTestId("contact-phone-input"));
        userEvent.paste(screen.getByTestId("contact-phone-input"), phone);
    });
};
