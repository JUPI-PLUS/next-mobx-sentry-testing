import React, { FC, useEffect, useRef } from "react";
import { PopperProps } from "./models";
import usePopperWindow from "../../../shared/hooks/usePopover";
import { createPortal } from "react-dom";
import { useClickAway } from "../../../shared/hooks/useClickAway";
import isEmpty from "lodash/isEmpty";

const Popper: FC<PopperProps> = ({
    isOpen = false,
    onClose,
    placement,
    className,
    sourceRef,
    children,
    offsetDistance,
    offsetSkidding,
    closeOnClickOnSource,
}) => {
    const { visible, setVisibility, popperRef, styles, attributes, update } = usePopperWindow(
        sourceRef,
        placement,
        offsetDistance,
        offsetSkidding
    );
    useClickAway(popperRef, onClose, closeOnClickOnSource ? undefined : sourceRef);
    const ref = useRef<HTMLBodyElement | null>(null);

    useEffect(() => {
        setVisibility(isOpen);

        return () => {
            setVisibility(false);
        };
    }, [isOpen, setVisibility]);

    useEffect(() => {
        if (visible) {
            update?.();
        }
    }, [update, visible]);

    useEffect(() => {
        ref.current = document.querySelector("body");
    }, []);

    return isOpen && ref.current
        ? createPortal(
              <div
                  ref={popperRef}
                  style={styles.popper}
                  {...attributes.popper}
                  className={`${className} ${isEmpty(attributes.popper) ? "hidden" : "visible"} z-10`}
              >
                  {isOpen ? children : null}
              </div>,
              ref.current!
          )
        : null;
};

export default Popper;
