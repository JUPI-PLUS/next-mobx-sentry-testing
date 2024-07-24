import Radio from "./Radio";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useArgs } from "@storybook/client-api";
import React from "react";

export default {
    title: "uiKit/Radio/Radio",
    component: Radio,
    argTypes: {
        name: {
            defaultValue: "my-radio",
            table: {
                disable: true,
            },
        },
        checked: {
            defaultValue: true,
        },
        disabled: {
            defaultValue: false,
        },
        value: {
            defaultValue: "Radio value",
            table: {
                disable: true,
            },
        },
        label: {
            defaultValue: "Radio label",
        },
    },
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = args => {
    const [, updateArgs] = useArgs();
    return <Radio {...args} onChange={e => updateArgs({ checked: e.target.checked })} />;
};

export const Default = Template.bind({});
Default.args = {};
