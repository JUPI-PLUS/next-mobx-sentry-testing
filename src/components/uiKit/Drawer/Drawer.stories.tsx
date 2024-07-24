import { ComponentMeta, ComponentStory } from "@storybook/react";
import Drawer from "./Drawer";

export default {
    title: "uiKit/Drawer",
    component: Drawer,
    argTypes: {
        isOpen: {
            defaultValue: true,
        },
        title: {
            defaultValue: "Drawer title",
        },
        cancelText: {
            defaultValue: "Close",
        },
        submitText: {
            defaultValue: "Submit",
        },
        submitButtonVariant: {
            defaultValue: "primary",
        },
        cancelButtonVariant: {
            defaultValue: "primary",
        },
        onClose: {
            // eslint-disable-next-line no-console
            defaultValue: () => console.log("close"),
            table: {
                disable: true,
            },
        },
        onSubmit: {
            table: {
                disable: true,
            },
        },
        onCancel: {
            table: {
                disable: true,
            },
        },
        containerClass: {
            defaultValue: "bg-dark-100",
        },
        couldCloseOnBackdrop: {
            defaultValue: true,
        },
        couldCloseOnEsc: {
            defaultValue: true,
        },
        side: {
            defaultValue: "left",
        },
        size: {
            defaultValue: "xs",
        },
        children: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof Drawer>;

const Template: ComponentStory<typeof Drawer> = args => <Drawer {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, in, unde? Aliquam asperiores impedit
            ipsa iste laborum libero nemo omnis placeat porro quis, recusandae rerum tempora tenetur voluptas,
            voluptatem voluptates.
        </p>
    ),
};
