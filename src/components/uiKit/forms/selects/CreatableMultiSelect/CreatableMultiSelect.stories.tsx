import { ComponentMeta, ComponentStory } from "@storybook/react";
import CreatableMultiSelect from "./CreatableMultiSelect";

export default {
    title: "uiKit/Selectors/CreatableMultiSelect",
    component: CreatableMultiSelect,
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
} as ComponentMeta<typeof CreatableMultiSelect>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof CreatableMultiSelect<Option>> = args => <CreatableMultiSelect {...args} />;

export const Default = Template.bind({});
Default.args = {};
