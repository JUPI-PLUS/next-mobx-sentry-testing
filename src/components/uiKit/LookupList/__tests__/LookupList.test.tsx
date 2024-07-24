import { act, render, screen } from "@testing-library/react";
import LookupList from "../LookupList";
import userEvent from "@testing-library/user-event";

const MOCKED_ON_RESET = jest.fn();
const MOCKED_ON_SUBMIT = jest.fn();
const MOCKED_LOOKUP_LIST = new Array(7).fill(null).map((_, index) => ({ value: index, label: "test" + index }));
const MOCKED_FIRST_LOOKUP_LIST_ITEM = MOCKED_LOOKUP_LIST[0];
const MOCKED_SECOND_LOOKUP_LIST_ITEM = MOCKED_LOOKUP_LIST[1];
const MOCKED_SELECTED_LOOKUP_LIST = [MOCKED_FIRST_LOOKUP_LIST_ITEM];

const setup = () => {
    render(
        <LookupList
            lookups={MOCKED_LOOKUP_LIST}
            matchField={"label"}
            selectedLookups={MOCKED_SELECTED_LOOKUP_LIST}
            onReset={MOCKED_ON_RESET}
            onSubmit={MOCKED_ON_SUBMIT}
        >
            <button data-testid="setup-btn">Click me</button>
        </LookupList>
    );
};

describe("LookupList component", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("Should render component without errors", () => {
        setup();

        expect(screen.queryByTestId(`lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)).not.toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        })

        expect(screen.getByTestId(`lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)).toBeInTheDocument();
    });

    it("Should call onSubmit callback with selected lookup items by clicking submit button", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        })

        act(() => {
            userEvent.click(screen.getByTestId("lookup-list-submit-button"));
        })

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith(MOCKED_SELECTED_LOOKUP_LIST);
    });

    it("Should call onReset callback by clicking reset button", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        });

        act(() => {
            userEvent.click(screen.getByTestId("lookup-list-reset-button"));
        })

        expect(MOCKED_ON_RESET).toHaveBeenCalled();
    });

    it("Should select list item by clicking on item", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        });

        expect(
            screen.queryByTestId(`checked-lookup-list-item-${MOCKED_SECOND_LOOKUP_LIST_ITEM.value}`)
        ).not.toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_SECOND_LOOKUP_LIST_ITEM.value}`));
        });

        expect(
            screen.getByTestId(`checked-lookup-list-item-${MOCKED_SECOND_LOOKUP_LIST_ITEM.value}`)
        ).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId("lookup-list-submit-button"));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith([...MOCKED_SELECTED_LOOKUP_LIST, MOCKED_SECOND_LOOKUP_LIST_ITEM]);
    });

    it("Should select a range by clicking with shift being pressed", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        });

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_LOOKUP_LIST[1].value}`));
        });

        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[1].value}`)).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_LOOKUP_LIST[3].value}`), { shiftKey: true });
        })

        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[1].value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[2].value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[3].value}`)).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId("lookup-list-submit-button"));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith([
            MOCKED_LOOKUP_LIST[1],
            MOCKED_LOOKUP_LIST[2],
            MOCKED_LOOKUP_LIST[3],
        ]);
    });

    it("Should select a range with shift being pressed, starting from bigger value", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        })

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_LOOKUP_LIST[3].value}`));
        })

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_LOOKUP_LIST[0].value}`), { shiftKey: true });
        })

        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[0].value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[1].value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[2].value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`checked-lookup-list-item-${MOCKED_LOOKUP_LIST[3].value}`)).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId("lookup-list-submit-button"));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith([
            ...MOCKED_SELECTED_LOOKUP_LIST,
            MOCKED_LOOKUP_LIST[1],
            MOCKED_LOOKUP_LIST[2],
            MOCKED_LOOKUP_LIST[3],
        ]);
    });

    it("Should remove selected icon by clicking on selected item", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        });

        expect(
            screen.getByTestId(`checked-lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)
        ).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId(`lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`));
        });

        expect(
            screen.queryByTestId(`checked-lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)
        ).not.toBeInTheDocument();
    });

    it("Should find item by label", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        })

        expect(screen.getByTestId(`lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`lookup-list-item-${MOCKED_SECOND_LOOKUP_LIST_ITEM.value}`)).toBeInTheDocument();

        act(() => {
            userEvent.paste(screen.getByTestId("lookup-list-search-input"), MOCKED_FIRST_LOOKUP_LIST_ITEM.label);
        });

        expect(screen.getByTestId(`lookup-list-item-${MOCKED_FIRST_LOOKUP_LIST_ITEM.value}`)).toBeInTheDocument();
        expect(
            screen.queryByTestId(`lookup-list-item-${MOCKED_SECOND_LOOKUP_LIST_ITEM.value}`)
        ).not.toBeInTheDocument();
    });

    it("Should display 'Nothing found' if input label not exist", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("setup-btn"));
        })

        expect(screen.queryByTestId("nothing-found")).not.toBeInTheDocument();

        act(() => {
            userEvent.paste(
                screen.getByTestId("lookup-list-search-input"),
                MOCKED_FIRST_LOOKUP_LIST_ITEM.label + MOCKED_FIRST_LOOKUP_LIST_ITEM.label
            );
        });

        expect(screen.getByTestId("nothing-found")).toBeInTheDocument();
    });
});
