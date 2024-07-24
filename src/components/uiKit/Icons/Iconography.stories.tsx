import React from "react";
import * as Icons from "./index";
import { ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/Iconography",
    parameters: {
        viewport: {
            defaultViewport: "tablet",
        },
    },
};

const Iconography = (args: { className: string }) => (
    <div className="grid grid-cols-6">
        {Object.entries(Icons).map(([name, IconComponent]) => {
            return (
                <div className="flex flex-col items-center px-4 py-8">
                    <IconComponent {...args} />
                    <span className="break-words break-word text-center">{name}</span>
                </div>
            );
        })}
    </div>
);

const Template: ComponentStory<typeof Iconography> = args => <Iconography {...args} />;

export const Default = Template.bind({});

Default.args = {
    className: "stroke-dark-900 w-12 h-12",
};
