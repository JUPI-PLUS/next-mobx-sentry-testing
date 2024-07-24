import { act, render, screen } from "@testing-library/react";
import RoutingTabs from "../RoutingTabs";
import TabPanel from "../../components/TabPanel/TabPanel";

const MOCKED_ITEMS = [
    {
        label: "Tab one",
        name: "first"
    },
    {
        label: "Tab two",
        name: "second"
    },
    {
        label: "Tab three",
        name: "third"
    }
];

const MOCKED_TABS_CONTENT = [
    {
        text: "Tab content one"
    },
    {
        text: "Tab content two"
    },
    {
        text: "Tab content three"
    }
];

const MOCK_ROUTER_PUSH = jest.fn();
const MOCKED_ROUTER_QUERY = jest.fn();
const MOCKED_ROUTER_IS_READY = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCKED_ROUTER_QUERY(),
            push: MOCK_ROUTER_PUSH,
            isReady: MOCKED_ROUTER_IS_READY(),
        };
    }
}));

const setup = () => {
    render(
        <RoutingTabs tabs={MOCKED_ITEMS}>
            {MOCKED_TABS_CONTENT.map(({ text }) => <TabPanel key={text}><p>{text}</p></TabPanel>)}
        </RoutingTabs>
    );
}

describe("RoutingTabs component", () => {
    it("Should render component without errors", async () => {
        MOCKED_ROUTER_IS_READY.mockReturnValue(true)
        MOCKED_ROUTER_QUERY.mockReturnValue({
            tab: MOCKED_ITEMS[0].name,
        });

        await act(async () => {
            setup();
        })

        expect(screen.getByText(MOCKED_ITEMS[0].label)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_TABS_CONTENT[0].text)).toBeInTheDocument();
    });

    it("Should render first tab content if query tab wasnt fit on any tab item", async () => {
        MOCKED_ROUTER_IS_READY.mockReturnValue(true)
        MOCKED_ROUTER_QUERY.mockReturnValue({
            tab: "something-not-fittable"
        });

        await act(async () => {
            setup();
        })

        expect(screen.getByText(MOCKED_TABS_CONTENT[0].text)).toBeInTheDocument();
    });

    it("Should render first tab content if query doesnt have tab parameter", async () => {
        MOCKED_ROUTER_IS_READY.mockReturnValue(true)
        MOCKED_ROUTER_QUERY.mockReturnValue({
            tab: undefined
        });

        await act(async () => {
            setup();
        })

        expect(screen.getByText(MOCKED_TABS_CONTENT[0].text)).toBeInTheDocument();
    });

    it("Should not render tab if is not ready", async () => {
        MOCKED_ROUTER_IS_READY.mockReturnValue(false)
        MOCKED_ROUTER_QUERY.mockReturnValue({
            tab: undefined
        });

        await act(async () => {
            setup();
        })

        expect(screen.queryByText(MOCKED_TABS_CONTENT[0].text)).not.toBeInTheDocument();
    });
});
