import { ComponentMeta, ComponentStory } from "@storybook/react";
import CreatableSelect from "./CreatableSelect";

export default {
    title: "uiKit/Selectors/CreatableMultiSelect",
    component: CreatableSelect,
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
} as ComponentMeta<typeof CreatableSelect>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof CreatableSelect<Option>> = args => <CreatableSelect {...args} />;

export const Default = Template.bind({});
Default.args = {};
