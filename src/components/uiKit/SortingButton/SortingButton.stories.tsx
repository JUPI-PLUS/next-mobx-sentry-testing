// libs
import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useArgs } from "@storybook/client-api";

// models
import { SortingWay } from "../../../shared/models/common";

// components
import SortingButton from "./SortingButton";

export default {
    title: "uiKit/SortingButton",
    component: SortingButton,
    argTypes: {
        sortDirection: {
            defaultValue: SortingWay.NONE,
        },
    },
} as ComponentMeta<typeof SortingButton>;

const Template: ComponentStory<typeof SortingButton> = args => {
    const [, updateArgs] = useArgs();
    return <SortingButton {...args} onClick={value => updateArgs({ sortDirection: value })} />;
};

export const Default = Template.bind({});
Default.args = {};
