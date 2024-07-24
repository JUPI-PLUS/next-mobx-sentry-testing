import TextArea from "./TextArea";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/TextArea",
    component: TextArea,
    argTypes: {
        value: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = args => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {};
