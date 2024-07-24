import { render, screen } from "@testing-library/react";
import { store } from "../../../../shared/store";
import { MOCK_USER } from "../../../../testingInfrustructure/mocks/users";
import Header from "../Header";

jest.mock("../../../../shared/hooks/useGetBase64Image", () => ({
    useGetBase64Image() {
        return {
            data: "stringOfBlobImage",
        };
    },
}));

const MOCKED_USER = MOCK_USER({});
const MOCKED_TITLE = "Header title";

describe("Header component", () => {
    beforeAll(() => {
        store.user.setUser(MOCKED_USER);
    });
    
    it("Should render component without error", () => {
        render(<Header title={MOCKED_TITLE} />);

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
    });
});
