import { ComponentMeta, ComponentStory } from "@storybook/react";
import DatePicker from "../DatePicker/DatePicker";
import FilterDatePicker from "./FilterDatePicker";

export default {
    title: "uiKit/Datepickers/FilterDatePicker",
    component: FilterDatePicker,
    argTypes: {
        value: {
            table: {
                disable: true,
            },
        },
        date: {
            table: {
                disable: true,
            },
        },
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
        onBlur: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = args => (
    <div className="w-80">
        <FilterDatePicker {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {};
