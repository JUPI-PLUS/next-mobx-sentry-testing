import Breadcrumbs from "./Breadcrumbs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Breadcrumbs",
    component: Breadcrumbs,
    argTypes: {
        label: {
            defaultValue: "Hello breadcrumbs",
        },
    },
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = args => <Breadcrumbs {...args} />;

export const Default = Template.bind({});
Default.args = {};
