// libs
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// models
import { SortingWay } from "../../../../shared/models/common";

// components
import SortingButton from "../SortingButton";

const MOCKED_CLICK = jest.fn();

describe("SortingButton component", () => {
    it.each<{ sortDirection: SortingWay; clickValue: SortingWay }>([
        {
            sortDirection: SortingWay.ASC,
            clickValue: SortingWay.DESC,
        },
        {
            sortDirection: SortingWay.DESC,
            clickValue: SortingWay.NONE,
        },
        {
            sortDirection: SortingWay.NONE,
            clickValue: SortingWay.ASC,
        },
    ])(
        "Should render sorting icon according to sortDirection and call onClick with right value",
        async ({ sortDirection, clickValue }) => {
            await render(<SortingButton sortDirection={sortDirection} onClick={MOCKED_CLICK} />);

            expect(screen.getByTestId(`sort-icon-${sortDirection}`)).toBeInTheDocument();

            await act(() => {
                userEvent.click(screen.getByTestId("order-way-button"));
            });

            expect(MOCKED_CLICK).toHaveBeenCalledWith(clickValue);
        }
    );
});
