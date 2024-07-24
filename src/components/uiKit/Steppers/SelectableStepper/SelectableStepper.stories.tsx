//  libs
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useArgs } from "@storybook/client-api";

//  components
import SelectableStepper from "./SelectableStepper";

export default {
    title: "uiKit/Steppers/SelectableStepper",
    component: SelectableStepper,
    argTypes: {
        titles: {
            defaultValue: ["First title", "", "Third title"],
        },
        activeStep: {
            defaultValue: 0,
        },
        containerClassName: {
            defaultValue: "max-w-2xl mx-auto",
        },
        headerClassName: {
            defaultValue: "mb-14",
        },
        children: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof SelectableStepper>;

const Template: ComponentStory<typeof SelectableStepper> = args => {
    const [, updateArgs] = useArgs();

    return (
        <SelectableStepper {...args} setActiveStep={step => updateArgs({ activeStep: step })}>
            <p>
                FIRST Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, in, unde? Aliquam asperiores
                impedit ipsa iste laborum libero nemo omnis placeat porro quis, recusandae rerum tempora tenetur
                voluptas, voluptatem voluptates.
            </p>
            <p>SECOND Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p>
                THIRD Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, in, unde? Aliquam asperiores
                impedit ipsa iste laborum libero nemo omnis placeat porro quis.
            </p>
        </SelectableStepper>
    );
};

export const Default = Template.bind({});
