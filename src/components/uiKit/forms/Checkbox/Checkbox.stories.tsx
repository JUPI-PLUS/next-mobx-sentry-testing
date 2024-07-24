import Checkbox from "./Checkbox";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Checkbox/Check",
    component: Checkbox,
    argTypes: {
        name: {
            defaultValue: "my-checkbox",
            table: {
                disable: true,
            },
        },
        checkboxRef: {
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
            defaultValue: "Checkbox label",
        },
    },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = args => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {};
