import { ComponentMeta, ComponentStory } from "@storybook/react";
import TableStatus from "./TableStatus";

export default {
    title: "uiKit/Statuses/TableStatus",
    component: TableStatus,
    argTypes: {
        text: {
            defaultValue: "Any status text",
        },
        variant: {
            defaultValue: "primary",
        },
    },
} as ComponentMeta<typeof TableStatus>;

const Template: ComponentStory<typeof TableStatus> = args => <TableStatus {...args} />;

export const Default = Template.bind({});
Default.args = {};
