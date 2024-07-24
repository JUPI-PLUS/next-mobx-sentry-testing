import { ComponentStory } from "@storybook/react";
import { Tooltip } from "./Tooltip";

export default {
    title: "uiKit/Tooltip",
    component: Tooltip,
    argTypes: {
        children: {
            control: { type: "text" },
        },
        text: {
            control: { type: "text" },
        },
        ifTruncate: {
            control: { type: "boolean" },
        },
    },
};

const Template: ComponentStory<typeof Tooltip> = ({ children, text, isStatic, placement }) => {
    return (
        <div className="mt-10 ml-10">
            <Tooltip text={text} isStatic={isStatic} placement={placement}>
                {children}
            </Tooltip>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    children: <p>Lorem ipsum dolor</p>,
    text: "Tooltip text",
};

export const WithTruncate = Template.bind({});
WithTruncate.args = {
    children: (
        <div className="w-10">
            <p className="truncate">Lorem ipsum dolor</p>
        </div>
    ),
    text: "Tooltip text",
    isStatic: false,
};
