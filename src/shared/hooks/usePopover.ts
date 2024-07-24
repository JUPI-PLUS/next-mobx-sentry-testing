import { Placement } from "@popperjs/core/lib/enums";
import { CSSProperties, Dispatch, MutableRefObject, SetStateAction, useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { State } from "@popperjs/core";

const getOffset = (skidding?: number, distance?: number) => {
    return {
        name: "offset",
        options: {
            offset: [skidding || 0, distance || 0],
        },
    };
};

const usePopperWindow = (
    sourceRef: MutableRefObject<HTMLElement | SVGSVGElement | null>,
    placement?: Placement,
    offsetDistance?: number,
    offsetSkidding?: number
): {
    popperRef: MutableRefObject<null>;
    visible: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
    styles: Record<string, CSSProperties>;
    attributes: Record<string, Record<string, string> | undefined>;
    update: (() => Promise<Partial<State>>) | null;
} => {
    const [visible, setVisibility] = useState(false);
    const popperRef = useRef(null);

    const getModifiers = useCallback(() => {
        const modifiers = [];

        if (offsetSkidding || offsetDistance) {
            modifiers.push(getOffset(offsetSkidding, offsetDistance));
        }

        return modifiers;
    }, [offsetDistance, offsetSkidding]);

    const { styles, attributes, update } = usePopper(sourceRef.current, popperRef.current, {
        placement: placement || "auto",
        modifiers: getModifiers(),
    });

    return { popperRef, visible, setVisibility, styles, attributes, update };
};

export default usePopperWindow;
