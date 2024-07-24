// libs
import { ComponentMeta, ComponentStory } from "@storybook/react";

// components
import ProgressBar from "./ProgressBar";

export default {
    title: "uiKit/ProgressBar",
    component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = args => <ProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    className: "bg-brand-100",
};
