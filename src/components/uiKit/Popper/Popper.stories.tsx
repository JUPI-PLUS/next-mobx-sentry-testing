import { ComponentMeta, ComponentStory } from "@storybook/react";
import Popper from "./Popper";
import React, { useRef } from "react";
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

export default {
    title: "uiKit/Popper",
    component: Popper,
    argTypes: {
        children: {
            control: { type: "text" },
        },
        isOpen: {
            table: {
                disable: true,
            },
        },
        onClose: {
            table: {
                disable: true,
            },
        },
        className: {
            table: {
                disable: true,
            },
        },
        sourceRef: {
            table: {
                disable: true,
            },
        },
        offsetSkidding: {
            defaultValue: 10,
        },
        offsetDistance: {
            defaultValue: 10,
        },
    },
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = ({ placement, offsetDistance, offsetSkidding, children }) => {
    const buttonRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center">
                <button className="mt-20" onClick={onOpen} ref={buttonRef}>
                    Click me to see poppover
                </button>
                <Popper
                    isOpen={isOpen}
                    sourceRef={buttonRef}
                    onClose={onClose}
                    placement={placement}
                    offsetDistance={offsetDistance}
                    offsetSkidding={offsetSkidding}
                >
                    <div className="p-2 bg-white shadow-menu-dropdown" data-testid="dropdown-container">
                        {children}
                    </div>
                </Popper>
            </div>
        </>
    );
};

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
