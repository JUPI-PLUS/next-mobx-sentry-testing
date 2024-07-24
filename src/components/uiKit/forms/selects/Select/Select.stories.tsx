import { ComponentMeta, ComponentStory } from "@storybook/react";
import Select from "./Select";

export default {
    title: "uiKit/Selectors/Select",
    component: Select,
    argTypes: {
        name: {
            table: {
                disable: true,
            },
        },
        onChange: {
            table: {
                disable: true,
            },
        },
        options: {
            defaultValue: [
                { label: "A", value: "a" },
                { label: "B", value: "b" },
                { label: "C", value: "c", disabled: true },
            ],
        },
    },
} as ComponentMeta<typeof Select>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof Select<Option>> = args => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {};
