import Badge from "./Badge";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Badge",
    component: Badge,
    argTypes: {
        text: {
            defaultValue: "Hello badge",
        },
        variant: {
            defaultValue: "info",
        },
    },
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = args => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {};
