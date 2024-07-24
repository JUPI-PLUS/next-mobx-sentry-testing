// libs
import { render, screen } from "@testing-library/react";
import { format, fromUnixTime } from "date-fns";
import { QueryClient, QueryClientProvider } from "react-query";

// helpers
import { addOffsetToUtcDate } from "../../../../shared/utils/date";

// constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../../shared/constants/user";

// components
import UserDetailsCard from "../UserDetailsCard";

// mocks
import { MOCK_PATIENT } from "../../../../testingInfrustructure/mocks/users";

const setup = (props = {}) => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <UserDetailsCard
                uuid=""
                firstName={MOCK_PATIENT.first_name}
                lastName={MOCK_PATIENT.last_name}
                birthday={MOCK_PATIENT.birth_date}
                avatar=""
                variant="info"
                isDeleted={false}
                barcode={MOCK_PATIENT.barcode}
                {...props}
            />
        </QueryClientProvider>
    );
};

describe("UserDetailsCard component", () => {
    it("Should render card data correctly", () => {
        setup();
        expect(screen.getByTestId("user-details-card-full-name")).toHaveTextContent(
            `${MOCK_PATIENT.first_name} ${MOCK_PATIENT.last_name}`
        );
        expect(screen.getByTestId("user-details-card-birthdate")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCK_PATIENT.birth_date!)), DATE_FORMATS.DATE_ONLY)
        );
    });

    it("Should render card data correctly if user is deleted", () => {
        setup({ isDeleted: true });
        expect(screen.getByTestId("user-details-card-full-name")).toHaveTextContent(MOCK_PATIENT.barcode);
        expect(screen.getByTestId("user-details-card-birthdate")).toHaveTextContent(DEFAULT_DELETED_USER_MOCK_TEXT);
    });

    it.each<{ variant: "info" | "active"; expectedClass: string }>([
        {
            variant: "info",
            expectedClass: "text-dark-900",
        },
        {
            variant: "active",
            expectedClass: "bg-brand-100 text-white",
        },
    ])("Should render card according to variant", ({ variant, expectedClass }) => {
        setup({ variant });
        expect(
            screen.getByTestId(`user-details-card-${MOCK_PATIENT.first_name}-${MOCK_PATIENT.last_name}`)
        ).toBeInTheDocument();
        expect(
            screen.getByTestId(`user-details-card-${MOCK_PATIENT.first_name}-${MOCK_PATIENT.last_name}`)
        ).toHaveClass(expectedClass);
    });
});
