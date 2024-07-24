// libs
import { ComponentMeta, ComponentStory } from "@storybook/react";

// components
import StackedProgressBar from "./StackedProgressBars";

export default {
    title: "uiKit/ProgressBar/Stacked",
    component: StackedProgressBar,
} as ComponentMeta<typeof StackedProgressBar>;

const Template: ComponentStory<typeof StackedProgressBar> = args => <StackedProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: 228,
    withPinIcon: false,
    progressBars: [
        {
            keyId: "1",
            color: "#39B983",
            from: 0,
            to: 100,
            hasMarker: false,
        },
        {
            keyId: "2",
            color: "#FE9C55",
            from: 100,
            to: 200,
            hasMarker: false,
        },
        {
            keyId: "3",
            color: "#DDB669",
            from: 200,
            to: 300,
            hasMarker: true,
        },
        {
            keyId: "4",
            color: "#CD445D",
            from: 300,
            to: 700,
            hasMarker: false,
        },
    ],
};
