import { ComponentMeta, ComponentStory } from "@storybook/react";
import RichText from "./RichText";

export default {
    title: "uiKit/RichText",
    component: RichText,
} as ComponentMeta<typeof RichText>;

const Template: ComponentStory<typeof RichText> = args => <RichText {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: "",
    value: "",
    autoFocus: true,
};
