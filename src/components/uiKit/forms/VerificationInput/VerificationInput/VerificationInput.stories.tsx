import { ComponentMeta, ComponentStory } from "@storybook/react";
import VerificationInput from "./VerificationInput";
import React from "react";

export default {
    title: "uiKit/VerificationInput",
    component: VerificationInput,
    args: {
        value: "12345",
    },
} as ComponentMeta<typeof VerificationInput>;

const Template: ComponentStory<typeof VerificationInput> = args => <VerificationInput autoFocus {...args} />;

export const Default = Template.bind({});
Default.args = {};
