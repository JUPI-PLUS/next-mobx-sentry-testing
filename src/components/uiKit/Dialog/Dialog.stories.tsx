import { ComponentMeta, ComponentStory } from "@storybook/react";
import Dialog from "./Dialog";

export default {
    title: "uiKit/Dialog",
    component: Dialog,
    argTypes: {
        isOpen: {
            defaultValue: true,
        },
        title: {
            defaultValue: "Modal title",
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
        children: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = args => <Dialog {...args} />;

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
