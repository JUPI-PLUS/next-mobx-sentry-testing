import Toggle from "./Toggle";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Toggle",
    component: Toggle,
    argTypes: {
        name: {
            defaultValue: "my-Toggle",
            table: {
                disable: true,
            },
        },
        value: {
            table: {
                disable: true,
            },
        },
        defaultChecked: {
            defaultValue: true,
        },
        label: {
            defaultValue: "Toggle label",
        },
    },
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = args => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {};
