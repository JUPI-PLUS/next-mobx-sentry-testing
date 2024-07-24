import Header from "./Header";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Header",
    component: Header,
    argTypes: {
        title: {
            defaultValue: "Hello header",
        },
    },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = args => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {};
