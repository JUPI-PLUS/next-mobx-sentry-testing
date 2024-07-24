import { ComponentMeta, ComponentStory } from "@storybook/react";
import ExamStatus from "./ExamStatus";

export default {
    title: "uiKit/Statuses/ExamStatus",
    component: ExamStatus,
    argTypes: {
        text: {
            defaultValue: "Any status text",
        },
        variant: {
            defaultValue: "primary",
        },
    },
} as ComponentMeta<typeof ExamStatus>;

const Template: ComponentStory<typeof ExamStatus> = args => <ExamStatus {...args} />;

export const Default = Template.bind({});
Default.args = {};
