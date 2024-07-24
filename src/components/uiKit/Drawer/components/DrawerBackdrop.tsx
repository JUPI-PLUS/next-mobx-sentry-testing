import React, { FC, useCallback } from "react";
import { DrawerBackdropProps } from "../models";

const DrawerBackdrop: FC<DrawerBackdropProps> = ({ couldCloseOnBackdrop, onClose }) => {
    const onClickOnBackdrop = useCallback(() => {
        if (couldCloseOnBackdrop) {
            onClose();
        }
    }, [couldCloseOnBackdrop, onClose]);

    return <div className="fixed z-40 bg-black opacity-25 w-full h-full top-0 left-0" onClick={onClickOnBackdrop} />;
};

export default React.memo(DrawerBackdrop);
