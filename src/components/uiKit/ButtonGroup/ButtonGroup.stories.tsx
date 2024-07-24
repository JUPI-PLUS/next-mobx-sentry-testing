import ButtonGroup from "./ButtonGroup";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OutlineButton } from "../Button/Button";

export default {
    title: "uiKit/ButtonGroup",
    component: ButtonGroup,
    argTypes: {},
} as ComponentMeta<typeof ButtonGroup>;

const Template: ComponentStory<typeof ButtonGroup> = args => (
    <ButtonGroup {...args}>
        <OutlineButton text={1} />
        <OutlineButton text={2} />
        <OutlineButton text={3} />
        <OutlineButton text={4} />
        <OutlineButton text={5} />
    </ButtonGroup>
);

export const Default = Template.bind({});
Default.args = {};
