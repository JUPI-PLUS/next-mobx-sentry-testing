// libs
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";

// api
import { getEmailTypes, getPhoneTypes } from "../../../../../api/dictionaries";
import { createEmail, deleteEmail, editEmail, getEmailsList, setEmailPrimary } from "../../../../../api/emails";
import { createPhone, deletePhone, editPhone, getPhonesList, setPhonePrimary } from "../../../../../api/phones";

// helpers
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";

// components
import ContactsContainer from "../ContactsContainer";
import { showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";

// mocks
import { MOCK_PATIENT } from "../../../../../testingInfrustructure/mocks/users";
import { MOCKED_EMAIL_TYPES, MOCKED_PHONE_TYPES } from "../../../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_USER_EMAILS_LIST, MOCKED_USER_PHONES_LIST } from "../../../../../testingInfrustructure/mocks/contacts";
import { MAX_EMAIL_NUMBER, MAX_PHONE_NUMBER } from "../constants";

jest.mock("../../../../../api/dictionaries");
jest.mock("../../../../../api/phones");
jest.mock("../../../../../api/emails");
jest.mock("../../../../../components/uiKit/Toast/helpers");

const MOCKED_EMAIL_TYPES_REQUEST = mockFunction(getEmailTypes);
const MOCKED_PHONE_TYPES_REQUEST = mockFunction(getPhoneTypes);

const MOCKED_GET_EMAILS_LIST = mockFunction(getEmailsList);
const MOCKED_GET_EMAILS_LIST_QUERY_REQUEST = jest.fn();
const MOCKED_GET_PHONES_LIST = mockFunction(getPhonesList);
const MOCKED_GET_PHONES_LIST_QUERY_REQUEST = jest.fn();

const MOCKED_DELETE_EMAIL = mockFunction(deleteEmail);
const MOCKED_DELETE_EMAIL_QUERY_REQUEST = jest.fn();
const MOCKED_DELETE_PHONE = mockFunction(deletePhone);
const MOCKED_DELETE_PHONE_QUERY_REQUEST = jest.fn();

const MOCKED_SET_EMAIL_PRIMARY = mockFunction(setEmailPrimary);
const MOCKED_SET_EMAIL_PRIMARY_QUERY_REQUEST = jest.fn();
const MOCKED_SET_PHONE_PRIMARY = mockFunction(setPhonePrimary);
const MOCKED_SET_PHONE_PRIMARY_QUERY_REQUEST = jest.fn();

const MOCKED_CREATE_EMAIL = mockFunction(createEmail);
const MOCKED_CREATE_PHONE = mockFunction(createPhone);

const MOCKED_EDIT_EMAIL = mockFunction(editEmail);
const MOCKED_EDIT_EMAIL_QUERY_REQUEST = jest.fn();
const MOCKED_EDIT_PHONE = mockFunction(editPhone);
const MOCKED_EDIT_PHONE_QUERY_REQUEST = jest.fn();

const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);

const MOCKED_USER_EMAILS = MOCKED_USER_EMAILS_LIST();
const MOCKED_USER_PHONES = MOCKED_USER_PHONES_LIST();

jest.mock("../../../store", () => ({
    usePatientStore() {
        return {
            patientStore: {
                patient: MOCK_PATIENT,
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <ContactsContainer uuid={MOCK_PATIENT.uuid} />
        </QueryClientProvider>
    );
};

describe("Contacts tab", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_EMAIL_TYPES_REQUEST, { data: MOCKED_EMAIL_TYPES });
        resolveServerResponse(MOCKED_PHONE_TYPES_REQUEST, { data: MOCKED_PHONE_TYPES });

        resolveServerResponse(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST, {});
        MOCKED_GET_EMAILS_LIST.mockReturnValue(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST);
        resolveServerResponse(MOCKED_GET_PHONES_LIST_QUERY_REQUEST, {});
        MOCKED_GET_PHONES_LIST.mockReturnValue(MOCKED_GET_PHONES_LIST_QUERY_REQUEST);

        resolveServerResponse(MOCKED_DELETE_EMAIL_QUERY_REQUEST, {});
        MOCKED_DELETE_EMAIL.mockReturnValue(MOCKED_DELETE_EMAIL_QUERY_REQUEST);
        resolveServerResponse(MOCKED_DELETE_PHONE_QUERY_REQUEST, {});
        MOCKED_DELETE_PHONE.mockReturnValue(MOCKED_DELETE_PHONE_QUERY_REQUEST);

        resolveServerResponse(MOCKED_SET_EMAIL_PRIMARY_QUERY_REQUEST, {});
        MOCKED_SET_EMAIL_PRIMARY.mockReturnValue(MOCKED_SET_EMAIL_PRIMARY_QUERY_REQUEST);
        resolveServerResponse(MOCKED_SET_PHONE_PRIMARY_QUERY_REQUEST, {});
        MOCKED_SET_PHONE_PRIMARY.mockReturnValue(MOCKED_SET_PHONE_PRIMARY_QUERY_REQUEST);

        resolveServerResponse(MOCKED_CREATE_EMAIL, {});
        resolveServerResponse(MOCKED_CREATE_PHONE, {});

        resolveServerResponse(MOCKED_EDIT_EMAIL_QUERY_REQUEST, {});
        MOCKED_EDIT_EMAIL.mockReturnValue(MOCKED_EDIT_EMAIL_QUERY_REQUEST);
        resolveServerResponse(MOCKED_EDIT_PHONE_QUERY_REQUEST, {});
        MOCKED_EDIT_PHONE.mockReturnValue(MOCKED_EDIT_PHONE_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("emails-label")).toBeInTheDocument();
        expect(screen.getByTestId("phones-label")).toBeInTheDocument();
    });

    describe("Emails card", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST, { data: MOCKED_USER_EMAILS });
        });

        it("Should render component without errors", async () => {
            await act(async () => {
                setup();
            });
        });

        it("Should render correct data of email items", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByText(MOCKED_USER_EMAILS[0].email)).toBeInTheDocument();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_EMAILS[0].uuid}`)).toBeChecked();

            expect(screen.getByText(MOCKED_USER_EMAILS[1].email)).toBeInTheDocument();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_EMAILS[1].uuid}`)).not.toBeChecked();
        });

        it("Should call setEmailPrimary request", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_EMAILS[0].uuid}`)).toBeChecked();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_EMAILS[1].uuid}`)).not.toBeChecked();

            await act(async () => {
                userEvent.click(screen.getByTestId(`contact-primary-${MOCKED_USER_EMAILS[1].uuid}`));
            });

            expect(MOCKED_SET_EMAIL_PRIMARY).toHaveBeenCalledWith(MOCKED_USER_EMAILS[1].uuid);
        });

        it("Should open add email drawer", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("add-email-button"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add email");
        });

        it("Should open edit email drawer", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`action-button-contact-${MOCKED_USER_EMAILS[0].uuid}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("edit-contact"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Edit email");
        });

        it("Should call deleteEmail request", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`action-button-contact-${MOCKED_USER_EMAILS[1].uuid}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("delete-contact"));
            });

            expect(screen.getByText("Delete email")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_DELETE_EMAIL).toBeCalledWith(MOCKED_USER_EMAILS[1].uuid);
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
        });

        it("Should not show add email button if emails length === MAX_EMAIL_NUMBER", async () => {
            resolveServerResponse(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST, {
                data: MOCKED_USER_EMAILS_LIST(MAX_EMAIL_NUMBER),
            });

            await act(async () => {
                setup();
            });

            expect(screen.queryByTestId("add-email-button")).not.toBeInTheDocument();
        });

        it("Should render empty placeholder with add email button if emails are not provided", async () => {
            resolveServerResponse(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST, { data: [] });
            resolveServerResponse(MOCKED_GET_PHONES_LIST_QUERY_REQUEST, { data: MOCKED_USER_PHONES });

            await act(async () => {
                setup();
            });

            expect(screen.getByTestId("empty-placeholder-text")).toHaveTextContent("No added emails");
            expect(screen.getByTestId("empty-placeholder-add-contact-button")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("empty-placeholder-add-contact-button"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add email");
        });
    });

    describe("Phones card", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_GET_PHONES_LIST_QUERY_REQUEST, { data: MOCKED_USER_PHONES });
        });

        it("Should render correct data of email items", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByText(MOCKED_USER_PHONES[0].number)).toBeInTheDocument();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_PHONES[0].uuid}`)).toBeChecked();

            expect(screen.getByText(MOCKED_USER_PHONES[1].number)).toBeInTheDocument();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_PHONES[1].uuid}`)).not.toBeChecked();
        });

        it("Should call setPhonePrimary request", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_PHONES[0].uuid}`)).toBeChecked();
            expect(screen.getByTestId(`contact-primary-${MOCKED_USER_PHONES[1].uuid}`)).not.toBeChecked();

            await act(async () => {
                userEvent.click(screen.getByTestId(`contact-primary-${MOCKED_USER_PHONES[1].uuid}`));
            });

            expect(MOCKED_SET_PHONE_PRIMARY).toHaveBeenCalledWith(MOCKED_USER_PHONES[1].uuid);
        });

        it("Should open add phone drawer", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("add-phone-button"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add phone number");
        });

        it("Should open edit phone drawer", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`action-button-contact-${MOCKED_USER_PHONES[0].uuid}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("edit-contact"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Edit phone number");
        });

        it("Should call deletePhone request", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`action-button-contact-${MOCKED_USER_PHONES[1].uuid}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("delete-contact"));
            });

            expect(screen.getByText("Delete phone number")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_DELETE_PHONE).toBeCalledWith(MOCKED_USER_PHONES[1].uuid);
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
        });

        it("Should not show add phone button if phones length === MAX_PHONE_NUMBER", async () => {
            resolveServerResponse(MOCKED_GET_PHONES_LIST_QUERY_REQUEST, {
                data: MOCKED_USER_PHONES_LIST(MAX_PHONE_NUMBER),
            });

            await act(async () => {
                setup();
            });

            expect(screen.queryByTestId("add-phone-button")).not.toBeInTheDocument();
        });

        it("Should render empty placeholder with add phone button if phones are not provided", async () => {
            resolveServerResponse(MOCKED_GET_PHONES_LIST_QUERY_REQUEST, { data: [] });
            resolveServerResponse(MOCKED_GET_EMAILS_LIST_QUERY_REQUEST, { data: MOCKED_USER_EMAILS });

            await act(async () => {
                setup();
            });

            expect(screen.getByTestId("empty-placeholder-text")).toHaveTextContent("No added phones");
            expect(screen.getByTestId("empty-placeholder-add-contact-button")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("empty-placeholder-add-contact-button"));
            });

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add phone number");
        });
    });
});
