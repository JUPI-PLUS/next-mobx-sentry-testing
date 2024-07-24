import IndeterminateCheckbox from "./IndeterminateCheckbox";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IndeterminateCheckboxValues } from "./models";

export default {
    title: "uiKit/Checkbox/Indeterminate",
    component: IndeterminateCheckbox,
    argTypes: {
        name: {
            defaultValue: "my-checkbox",
            table: {
                disable: true,
            },
        },
        value: {
            defaultValue: IndeterminateCheckboxValues.Empty,
        },
        defaultChecked: {
            table: {
                disable: true,
            },
        },
        checkboxRef: {
            table: {
                disable: true,
            },
        },
        disabled: {
            defaultValue: true,
            table: {
                disable: true,
            },
        },
        checked: {
            table: {
                disable: true,
            },
        },
        label: {
            defaultValue: "Indeterminate label",
        },
    },
} as ComponentMeta<typeof IndeterminateCheckbox>;

const Template: ComponentStory<typeof IndeterminateCheckbox> = args => <IndeterminateCheckbox {...args} />;

export const Default = Template.bind({});
Default.args = {};
