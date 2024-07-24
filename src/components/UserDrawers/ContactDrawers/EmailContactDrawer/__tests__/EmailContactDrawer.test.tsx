// libs
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";

// api
import { getEmailTypes } from "../../../../../api/dictionaries";
import { createEmail, editEmail } from "../../../../../api/emails";

// helpers
import { mockFunction, rejectServerResponse, resolveServerResponse } from "../../../../../testingInfrustructure/utils";

// models
import { EmailContact } from "../../../../../shared/models/emails";

// constants
import { ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID, DEFAULT_EMAIL_TYPE_ID } from "../constants";

// components
import { showSuccessToast } from "../../../../uiKit/Toast/helpers";
import EmailContactDrawer from "../EmailContactDrawer";

// mocks
import { MOCK_PATIENT } from "../../../../../testingInfrustructure/mocks/users";
import { MOCKED_EMAIL_TYPES } from "../../../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_USER_EMAIL } from "../../../../../testingInfrustructure/mocks/contacts";

jest.mock("../../../../../api/dictionaries");
jest.mock("../../../../../api/emails");
jest.mock("../../../../../components/uiKit/Toast/helpers");

const MOCKED_EMAIL_TYPES_REQUEST = mockFunction(getEmailTypes);
const MOCKED_CREATE_EMAIL = mockFunction(createEmail);
const MOCKED_EDIT_EMAIL = mockFunction(editEmail);
const MOCKED_EDIT_EMAIL_QUERY_REQUEST = jest.fn();

const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);

const MOCKED_ON_CLOSE = jest.fn();
const MOCKED_ON_REFETCH = jest.fn();

const MOCKED_EMAIL = MOCKED_USER_EMAIL();
const MOCKED_EMAIL_NOT_VERIFIED = MOCKED_USER_EMAIL({ verified_at: null });

const mockedEmail = "my-email@gmail.com";
const mockedEmailInvalid = "my-invalid-email";

const setup = (contact: EmailContact | null = null) => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <EmailContactDrawer
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

describe("EmailContactDrawer component", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_EMAIL_TYPES_REQUEST, { data: MOCKED_EMAIL_TYPES });

        resolveServerResponse(MOCKED_CREATE_EMAIL, {});

        resolveServerResponse(MOCKED_EDIT_EMAIL_QUERY_REQUEST, {});
        MOCKED_EDIT_EMAIL.mockReturnValue(MOCKED_EDIT_EMAIL_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Add email", () => {
        it("Should render component without errors", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add email");
            const typeIdInputValue = renderResult!.querySelector('[name="type_id"]') as HTMLSelectElement;
            expect(typeIdInputValue).toHaveValue(String(DEFAULT_EMAIL_TYPE_ID));
            expect(screen.getByTestId("contact-email-input")).toHaveValue("");
        });

        it("Should call createEmail request", async () => {
            await act(async () => {
                setup();
            });

            await fillForm(mockedEmail, MOCKED_EMAIL_TYPES[1].name);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_EMAIL).toHaveBeenCalledWith({
                user_uuid: MOCK_PATIENT.uuid,
                type_id: MOCKED_EMAIL_TYPES[1].id,
                email: mockedEmail,
            });
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).toHaveBeenCalled();
        });

        it("Should not call createEmail request and show error message if email is invalid", async () => {
            await act(async () => {
                setup();
            });

            await fillForm(mockedEmailInvalid);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_EMAIL).not.toHaveBeenCalled();
            expect(screen.getByText("Please, enter a valid email")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).not.toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should call createEmail request and show error message if email already exists", async () => {
            rejectServerResponse(MOCKED_CREATE_EMAIL, {
                response: {
                    data: {
                        errors: [
                            {
                                field: "email",
                                message: ["The email is already associated."],
                                messageLocaliseId: [ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID],
                            },
                        ],
                    },
                },
            });

            await act(async () => {
                setup();
            });

            await fillForm(mockedEmail);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_CREATE_EMAIL).toHaveBeenCalledWith({
                user_uuid: MOCK_PATIENT.uuid,
                type_id: DEFAULT_EMAIL_TYPE_ID,
                email: mockedEmail,
            });
            expect(screen.getByText("The email is already associated.")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });
    });

    describe("Edit email", () => {
        it("Should render component without errors", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup(MOCKED_EMAIL);
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Edit email");
            const typeIdInputValue = renderResult!.querySelector('[name="type_id"]') as HTMLSelectElement;
            expect(typeIdInputValue).toHaveValue(String(MOCKED_EMAIL.type_id));
            expect(screen.getByTestId("contact-email-input")).toHaveValue(MOCKED_EMAIL.email);
        });

        it("Should call editEmail request", async () => {
            await act(async () => {
                setup(MOCKED_EMAIL_NOT_VERIFIED);
            });

            await fillForm(mockedEmail, MOCKED_EMAIL_TYPES[1].name);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_EMAIL).toHaveBeenCalledWith(MOCKED_EMAIL_NOT_VERIFIED.uuid);
            expect(MOCKED_EDIT_EMAIL_QUERY_REQUEST).toHaveBeenCalledWith({
                type_id: MOCKED_EMAIL_TYPES[1].id,
                email: mockedEmail,
            });
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).toHaveBeenCalled();
        });

        it("Should not call editEmail request and show error message if email is invalid", async () => {
            await act(async () => {
                setup(MOCKED_EMAIL_NOT_VERIFIED);
            });

            await fillForm(mockedEmailInvalid);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_EMAIL_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(screen.getByText("Please, enter a valid email")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).not.toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should call createEmail request and show error message if email already exists", async () => {
            rejectServerResponse(MOCKED_EDIT_EMAIL_QUERY_REQUEST, {
                response: {
                    data: {
                        errors: [
                            {
                                field: "email",
                                message: ["The email is already associated."],
                                messageLocaliseId: [ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID],
                            },
                        ],
                    },
                },
            });

            await act(async () => {
                setup(MOCKED_EMAIL_NOT_VERIFIED);
            });

            await fillForm(mockedEmail);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-drawer-button"));
            });

            expect(MOCKED_EDIT_EMAIL).toHaveBeenCalledWith(MOCKED_EMAIL_NOT_VERIFIED.uuid);
            expect(MOCKED_EDIT_EMAIL_QUERY_REQUEST).toHaveBeenCalledWith({
                type_id: MOCKED_EMAIL_NOT_VERIFIED.type_id,
                email: mockedEmail,
            });
            expect(screen.getByText("The email is already associated.")).toBeInTheDocument();
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
            expect(MOCKED_ON_REFETCH).toHaveBeenCalled();
            expect(MOCKED_ON_CLOSE).not.toHaveBeenCalled();
        });

        it("Should open drawer with disabled email field if email is verified", async () => {
            await act(async () => {
                setup(MOCKED_EMAIL);
            });

            expect(screen.queryByTestId("contact-email-input")).toBeDisabled();
        });
    });
});

const fillForm = async (email: string, typeId?: string) => {
    if (typeId) {
        await act(async () => {
            userEvent.click(screen.queryAllByRole("combobox")[0]);
        });
        await act(async () => {
            userEvent.click(screen.getByText(typeId));
        });
    }
    await act(async () => {
        userEvent.clear(screen.getByTestId("contact-email-input"));
        userEvent.paste(screen.getByTestId("contact-email-input"), email);
    });
};
