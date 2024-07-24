// libs
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, screen } from "@testing-library/react";

// helpers
import { mockFunction } from "../../../../testingInfrustructure/utils";
import { createSampleType } from "../../../../api/sampleTypes";

// components
import FormCreateSampleTypeDrawer from "../FormCreateSampleTypeDrawer";

const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_CREATE_SAMPLE_TYPE = mockFunction(createSampleType);
const MOCKED_RANDOM_NAME = faker.random.alpha(10);
const MOCKED_RANDOM_CODE = faker.random.numeric(2);

jest.mock("../../../../api/sampleTypes");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCKED_QUERY(),
            push: MOCKED_PUSH,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <FormCreateSampleTypeDrawer />
        </QueryClientProvider>
    );
};

describe("FormCreateSampleTypeDrawer", () => {
    it("Should render table component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("drawer-inner-container")).toBeInTheDocument();
        expect(screen.getByTestId("sample-type-code-input"));
        expect(screen.getByTestId("sample-type-name-input"));
        expect(screen.getByTestId("submit-drawer-button")).toBeDisabled();
    });

    it("Should call createSampleType by click on submit button", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("sample-type-code-input"), MOCKED_RANDOM_CODE);
        });
        await act(async () => {
            userEvent.paste(screen.getByTestId("sample-type-name-input"), MOCKED_RANDOM_NAME);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("submit-drawer-button"));
        });

        expect(MOCKED_CREATE_SAMPLE_TYPE).toBeCalledWith({
            code: MOCKED_RANDOM_CODE,
            name: MOCKED_RANDOM_NAME,
        });
    });
});
