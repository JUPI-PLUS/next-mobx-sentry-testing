import { act, render, screen } from "@testing-library/react";
import Forbidden from "../index";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

const MOCKED_REPLACE = jest.fn();

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <Forbidden />
        </QueryClientProvider>
    );
};

jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE,
        };
    },
}));

describe("Forbidden page", () => {
    it("Should render component without errors and redirect to dashboard on click on button", async () => {
        setup();

        expect(screen.getByText("Forbidden")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByRole("button", { name: "Go to dashboard" }));
        });

        expect(MOCKED_REPLACE).toHaveBeenCalled();
    });
});