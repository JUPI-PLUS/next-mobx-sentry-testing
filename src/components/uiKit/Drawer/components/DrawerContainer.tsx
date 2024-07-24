import React, { FC, useRef } from "react";
import { DrawerContainerProps } from "../models";

const DrawerContainer: FC<DrawerContainerProps> = ({ className = "", children, side }) => {
    const drawerContainerInner = useRef(null);

    const sidePosition = side === "left" ? "right-auto" : "left-auto";

    return (
        <aside
            data-testid="drawer-container"
            className={`fixed inset-0 ${sidePosition} ${className} flex items-center overflow-x-hidden overflow-y-auto z-50`}
        >
            <div
                ref={drawerContainerInner}
                data-testid="drawer-inner-container"
                className="flex flex-col h-full w-full max-h-screen bg-white border-r border-inset border-gray-200 shadow-menu"
            >
                <div className="rounded relative flex flex-col flex-grow w-full bg-white overflow-hidden">
                    {children}
                </div>
            </div>
        </aside>
    );
};

export default DrawerContainer;
