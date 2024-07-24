import { Children, cloneElement, isValidElement, ReactNode } from "react";
import { AdditionalGroupButtonProps, GroupButtonChildren, GroupButtonOrientation } from "./models";

export const renderGroupButtons = (
    children: GroupButtonChildren,
    orientation: GroupButtonOrientation,
    additionalProps: AdditionalGroupButtonProps
): ReactNode =>
    Children.map(children, (child, index) => {
        if (isValidElement(child)) {
            const lastChild = children.length - 1;
            let className = `${child.props.className ?? ""} `;

            switch (index) {
                case 0:
                    className += orientation === "vertical" ? "rounded-b-none" : "rounded-r-none";
                    break;
                case lastChild:
                    className += orientation === "vertical" ? "rounded-t-none border-t-0" : "rounded-l-none border-l-0";
                    break;
                default:
                    className = orientation === "vertical" ? "rounded-none border-t-0" : "rounded-none border-l-0";
                    break;
            }

            return cloneElement(child, {
                ...additionalProps,
                className,
            });
        }
        return child;
    });
