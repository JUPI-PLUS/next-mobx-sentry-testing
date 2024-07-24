import { ComponentMeta, ComponentStory } from "@storybook/react";
import PhoneInputs from "./PhoneInput";

export default {
    title: "uiKit/Inputs/Phone",
    component: PhoneInputs,
} as ComponentMeta<typeof PhoneInputs>;

const Template: ComponentStory<typeof PhoneInputs> = args => <PhoneInputs {...args} />;

export const Default = Template.bind({});
Default.args = {};
