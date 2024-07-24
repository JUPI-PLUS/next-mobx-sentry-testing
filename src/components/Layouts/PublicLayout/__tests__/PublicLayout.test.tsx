import { render, screen } from "@testing-library/react";
import PublicLayout from "../PublicLayout";
import { QueryClient, QueryClientProvider } from "react-query";

const MOCKED_CHILDREN_TEXT = "Hello!";

const MOCKED_REPLACE = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE
        };
    }
}));

const setup = () => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <PublicLayout><p>{MOCKED_CHILDREN_TEXT}</p></PublicLayout>
        </QueryClientProvider>
    );
}

describe("PublicLayout", () => {
    it("Should render without errors", () => {
        setup();

        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
    });
});
