import { ComponentMeta, ComponentStory } from "@storybook/react";
import DropdownContainer from "./DropdownContainer";

export default {
    title: "uiKit/Dropdown",
    component: DropdownContainer,
} as ComponentMeta<typeof DropdownContainer>;

const Template: ComponentStory<typeof DropdownContainer> = args => <DropdownContainer {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: <div>Test</div>,
    items: [
        {
            title: "title1",
            onClick: () => {},
            child: [
                {
                    title: "title1.1",
                    onClick: () => {},
                },
            ],
        },
        {
            title: "title2",
            onClick: () => {},
            child: [
                {
                    title: "title2.1",
                    onClick: () => {},
                },
                {
                    title: "title2.2",
                    onClick: () => {},
                    child: [
                        {
                            title: "title2.2.1",
                            onClick: () => {},
                        },
                    ],
                },
                {
                    title: "title2.3",
                    onClick: () => {},
                    child: [
                        {
                            title: "title2.3.1",
                            onClick: () => {},
                        },
                    ],
                },
            ],
        },
        {
            title: "title2",
            onClick: () => {},
            child: [
                {
                    title: "title2.1",
                    onClick: () => {},
                },
            ],
        },
    ],
};
