// libs
import { render, screen } from "@testing-library/react";
import { format, fromUnixTime } from "date-fns";
import { QueryClient, QueryClientProvider } from "react-query";

// helpers
import { addOffsetToUtcDate } from "../../../shared/utils/date";

// constants
import { DATE_FORMATS } from "../../../shared/constants/formates";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../shared/constants/user";

// components
import UserDetails from "../UserDetails";

// mocks
import { MOCK_DELETED_PATIENT, MOCK_PATIENT } from "../../../testingInfrustructure/mocks/users";

const setup = (props = {}) => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <UserDetails user={MOCK_PATIENT} {...props} />
        </QueryClientProvider>
    );
};

describe("UserDetails component", () => {
    it("Should render user details data correctly", () => {
        setup();
        expect(screen.getByTestId("user-full-name")).toHaveTextContent(
            `${MOCK_PATIENT.first_name} ${MOCK_PATIENT.last_name}`
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(MOCK_PATIENT.email!);
        expect(screen.getByTestId("user-birthdate")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCK_PATIENT.birth_date!)), DATE_FORMATS.DATE_ONLY)
        );
        expect(screen.getByTestId("user-barcode")).toHaveTextContent(MOCK_PATIENT.barcode);
    });

    it("Should render user details data correctly if user is deleted", () => {
        setup({ user: MOCK_DELETED_PATIENT });
        expect(screen.getByTestId("user-full-name")).toHaveTextContent(MOCK_DELETED_PATIENT.barcode);
        expect(screen.getByTestId("user-email")).toHaveTextContent(DEFAULT_DELETED_USER_MOCK_TEXT);
        expect(screen.getByTestId("user-birthdate")).toHaveTextContent(DEFAULT_DELETED_USER_MOCK_TEXT);
    });
});
