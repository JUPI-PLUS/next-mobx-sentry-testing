import { ComponentMeta, ComponentStory } from "@storybook/react";
import Accordion from "./Accordion";

export default {
    title: "uiKit/Accordion",
    component: Accordion,
    argTypes: {
        title: {
            defaultValue: "Hello Accordion",
        },
        children: {
            table: {
                disable: true,
            },
        },
        isOpen: {
            defaultValue: false,
        },
    },
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = args => (
    <>
        <Accordion {...args}>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur ex labore maiores maxime
                nisi quidem vel? A aspernatur corporis eos incidunt, laboriosam libero maiores mollitia nesciunt,
                quaerat quos sunt?
            </div>
        </Accordion>
        <Accordion {...args} title="Hello accordion 2" rounded={false}>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur ex labore maiores maxime
                nisi quidem vel? A aspernatur corporis eos incidunt, laboriosam libero maiores mollitia nesciunt,
                quaerat quos sunt?
            </div>
        </Accordion>
    </>
);

export const Default = Template.bind({});
Default.args = {};
