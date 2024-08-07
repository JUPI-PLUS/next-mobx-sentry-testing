import { TextButton } from "./Button";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default {
    title: "uiKit/Button/TextButton",
    component: TextButton,
    argTypes: {
        text: {
            defaultValue: "Click me",
        },
        variant: {
            defaultValue: "primary",
        },
        size: {
            defaultValue: "md",
        },
        className: {
            table: {
                disable: true,
            },
        },
        type: {
            table: {
                disable: true,
            },
        },
        startIcon: {
            table: {
                disable: true,
            },
        },
        endIcon: {
            table: {
                disable: true,
            },
        },
        onClick: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof TextButton>;

const Template: ComponentStory<typeof TextButton> = args => <TextButton {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const StartIcon = Template.bind({});
StartIcon.args = {
    startIcon: <InformationCircleIcon className="w-4 h-4" />,
};

export const EndIcon = Template.bind({});
EndIcon.args = {
    endIcon: <InformationCircleIcon className="w-4 h-4" />,
};
