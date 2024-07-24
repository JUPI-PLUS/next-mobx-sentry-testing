import { ComponentMeta, ComponentStory } from "@storybook/react";
import MultiSelect from "./MultiSelect";

export default {
    title: "uiKit/Selectors/CreatableMultiSelect",
    component: MultiSelect,
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
} as ComponentMeta<typeof MultiSelect>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof MultiSelect<Option>> = args => <MultiSelect {...args} />;

export const Default = Template.bind({});
Default.args = {};
