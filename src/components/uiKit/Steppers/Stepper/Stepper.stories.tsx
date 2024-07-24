import { ComponentMeta, ComponentStory } from "@storybook/react";
import Stepper from "./Stepper";

export default {
    title: "uiKit/Steppers/Stepper",
    component: Stepper,
    argTypes: {
        titles: {
            defaultValue: ["First title", "Second title", "Third title"],
        },
        activeStep: {
            defaultValue: 0,
        },
        containerClassName: {
            defaultValue: "max-w-2xl mx-auto",
        },
        children: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = args => (
    <Stepper {...args}>
        <p>
            FIRST Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, in, unde? Aliquam asperiores
            impedit ipsa iste laborum libero nemo omnis placeat porro quis, recusandae rerum tempora tenetur voluptas,
            voluptatem voluptates.
        </p>
        <p>SECOND Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        <p>
            THIRD Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, in, unde? Aliquam asperiores
            impedit ipsa iste laborum libero nemo omnis placeat porro quis.
        </p>
    </Stepper>
);

export const Default = Template.bind({});
