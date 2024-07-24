import { ComponentMeta, ComponentStory } from "@storybook/react";
import DatetimePicker from "./DatetimePicker";

export default {
    title: "uiKit/Datepickers/DatetimePicker",
    component: DatetimePicker,
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
} as ComponentMeta<typeof DatetimePicker>;

const Template: ComponentStory<typeof DatetimePicker> = args => (
    <div className="h-80 w-80">
        <DatetimePicker {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {};
