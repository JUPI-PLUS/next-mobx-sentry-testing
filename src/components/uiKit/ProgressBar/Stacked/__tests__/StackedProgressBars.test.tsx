import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { getReferenceColors } from "../../../../../api/dictionaries";
import { MOCKED_REFERENCE_COLORS } from "../../../../../testingInfrustructure/mocks/dictionaries";
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";
import { StackedProgressBarsProps } from "../models";
import StackedProgressBar from "../StackedProgressBars";

jest.mock("../../../../../api/dictionaries");

const getRandomValueFromRange = (from: number, to: number) => faker.datatype.number({ min: from + 1, max: to });

const MOCKED_VALUE = jest.fn();
const MOCKED_START_LABEL = "start";
const MOCKED_END_LABEL = "end";
const MOCKED_PROGRESS_BARS = [
    {
        keyId: "1",
        color: "#39B983",
        from: 0,
        to: 100,
        hasMarker: false,
    },
    {
        keyId: "2",
        color: "#FE9C55",
        from: 100,
        to: 200,
        hasMarker: false,
    },
    {
        keyId: "3",
        color: "#DDB669",
        from: 200,
        to: 300,
        hasMarker: true,
    },
    {
        keyId: "4",
        color: "#CD445D",
        from: 300,
        to: 700,
        hasMarker: false,
    },
];
const MOCKED_REFERENCE_COLORS_REQUEST = mockFunction(getReferenceColors);

const setup = (stackedBarProps?: Partial<StackedProgressBarsProps<undefined>>) => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <StackedProgressBar progressBars={MOCKED_PROGRESS_BARS} value={MOCKED_VALUE()} {...stackedBarProps} />
        </QueryClientProvider>
    );
};

describe("StackedProgressBars component", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_REFERENCE_COLORS_REQUEST, {
            data: MOCKED_REFERENCE_COLORS,
        });
    });

    it("Should render component without errors", () => {
        setup();

        expect(screen.getByTestId("stacked-progress-bar")).toBeInTheDocument();
        expect(screen.getAllByTestId("progress-bar").length).toEqual(4);
    });

    it("Should render component start and end label", () => {
        setup({ startLabel: MOCKED_START_LABEL, endLabel: MOCKED_END_LABEL });

        expect(screen.getByTestId("start-label")).toHaveTextContent(MOCKED_START_LABEL);
        expect(screen.getByTestId("end-label")).toHaveTextContent(MOCKED_END_LABEL);
    });

    it("Should render PinIcon in range", () => {
        const randomInterval = faker.helpers.arrayElement(MOCKED_PROGRESS_BARS);
        MOCKED_VALUE.mockReturnValue(getRandomValueFromRange(randomInterval.from, randomInterval.to));
        setup({ withPinIcon: true });

        expect(screen.getByTestId("pin-icon")).toBeInTheDocument();
    });
});
