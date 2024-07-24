import { render, screen } from "@testing-library/react";
import Tabs from "../Tabs";
import TabPanel from "../../components/TabPanel/TabPanel";

const MOCKED_TAB_INDEX = 1;
const MOCK_QUERY = jest.fn(() => ({ tab: MOCKED_TAB_INDEX }));
const MOCK_REPLACE = jest.fn();

jest.mock("../../../../../shared/hooks/useIsInViewport", () => jest.fn(() => false));
jest.mock("next/router", () => ({
    useRouter() {
        return {
            pathname: "/asd",
            replace: MOCK_REPLACE,
            query: MOCK_QUERY(),
        };
    },
}));

const MOCKED_ITEMS = [
    {
        label: "Tab one",
    },
    {
        label: "Tab two",
    },
    {
        label: "Tab three",
    },
];

const MOCKED_TABS_CONTENT = [
    {
        text: "Tab content one",
    },
    {
        text: "Tab content two",
    },
    {
        text: "Tab content three",
    },
];

describe("Tabs component", () => {
    it("Should render component without errors", async () => {
        render(
            <Tabs tabs={MOCKED_ITEMS}>
                {MOCKED_TABS_CONTENT.map(({ text }) => (
                    <TabPanel key={text}>
                        <p>{text}</p>
                    </TabPanel>
                ))}
            </Tabs>
        );

        expect(screen.getByText(MOCKED_ITEMS[MOCKED_TAB_INDEX].label)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_TABS_CONTENT[MOCKED_TAB_INDEX].text)).toBeInTheDocument();
    });

    it("Should render second tab content if defaultActiveIndex prop was provided", () => {
        render(
            <Tabs tabs={MOCKED_ITEMS} defaultActiveIndex={1}>
                {MOCKED_TABS_CONTENT.map(({ text }) => (
                    <TabPanel key={text}>
                        <p>{text}</p>
                    </TabPanel>
                ))}
            </Tabs>
        );

        expect(screen.getByText(MOCKED_TABS_CONTENT[1].text)).toBeInTheDocument();
    });

    it("Should log to console error if tab content didnt wrap by TabPanel component", () => {
        const consoleSpy = jest.spyOn(console, "error");
        render(
            <Tabs tabs={MOCKED_ITEMS}>
                {MOCKED_TABS_CONTENT.map(({ text }, index) => (
                    <p key={index}>{text}</p>
                ))}
            </Tabs>
        );

        expect(consoleSpy).toHaveBeenCalled();
        expect(screen.queryByText(MOCKED_TABS_CONTENT[0].text)).not.toBeInTheDocument();
    });

    it("Should render only one tab", () => {
        MOCK_QUERY.mockReturnValue({ tab: 0 });
        render(
            <Tabs tabs={[MOCKED_ITEMS[0]]}>
                <TabPanel>
                    <p>{MOCKED_TABS_CONTENT[0].text}</p>
                </TabPanel>
            </Tabs>
        );

        expect(screen.getByText(MOCKED_TABS_CONTENT[0].text)).toBeInTheDocument();
    });
});
