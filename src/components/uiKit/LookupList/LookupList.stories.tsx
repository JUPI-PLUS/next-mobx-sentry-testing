import { ComponentStory } from "@storybook/react";
import LookupList from "./LookupList";
import { OutlineButton } from "../Button/Button";

export default {
    title: "uiKit/LookupList",
    component: LookupList,
    argTypes: {
        children: {},
    },
};

const mockedLookupList = [
    { value: 1, label: "test1" },
    { value: 2, label: "test2" },
    { value: 3, label: "test3" },
    { value: 4, label: "test4" },
    { value: 5, label: "test5" },
    { value: 6, label: "test6" },
    { value: 7, label: "test7" },
    { value: 8, label: "test8" },
    { value: 9, label: "test9" },
    { value: 10, label: "test10" },
    { value: 11, label: "1#qwerty" },
];

const Template: ComponentStory<typeof LookupList> = ({ children, ...rest }) => (
    <div className="w-fit">
        <LookupList {...rest}>{children}</LookupList>
    </div>
);

export const Default = Template.bind({});
Default.args = {
    children: <OutlineButton text={"Click me"} />,
    lookups: mockedLookupList,
    selectedLookups: [mockedLookupList[0]],
    matchField: "label",
    onSubmit: selectedLookupsList => {
        // eslint-disable-next-line no-console
        console.log(selectedLookupsList);
    },
    onReset: () => {
        // eslint-disable-next-line no-console
        console.log("onReset");
    },
};
