import React, { FC, useMemo } from "react";
import { DrawerProps } from "./models";
import DrawerHeader from "./components/headers/DrawerHeader";
import DrawerFooter from "./components/DrawerFooter";
import DrawerContainer from "./components/DrawerContainer";
import DrawerBackdrop from "./components/DrawerBackdrop";

const DrawerInner: FC<DrawerProps> = ({
    isOpen,
    title,
    children,
    cancelText,
    submitText,
    optionalText,
    cancelButtonVariant = "primary",
    submitButtonVariant = "primary",
    submitButtonClassName,
    cancelButtonClassName,
    onClose,
    onCancel,
    onSubmit,
    onOptional,
    containerClass = "",
    couldCloseOnBackdrop,
    couldCloseOnEsc = false,
    side = "left",
    size = "xs",
    headerButton,
}) => {
    const sizeClassName = useMemo(() => {
        switch (size) {
            case "md":
                return "max-w-md";
            case "xl":
                return "max-w-xl";
            default:
                return "max-w-xs";
        }
    }, [size]);

    if (!isOpen) return null;

    return (
        <>
            <DrawerContainer
                className={`${sizeClassName} w-full ${isOpen ? "translate-x-0" : "-translate-x-80"} ${containerClass}`}
                onClose={onClose}
                side={side}
            >
                <DrawerHeader
                    title={title}
                    onClose={onClose}
                    couldCloseOnEsc={couldCloseOnEsc}
                    headerButton={headerButton}
                />
                <div className="flex flex-col h-full overflow-x-auto">
                    <div className="relative flex-grow h-full flex-auto overflow-x-auto mb-4 p-6">{children}</div>
                </div>
                {onSubmit && (
                    <DrawerFooter
                        optionalText={optionalText}
                        cancelText={cancelText}
                        submitText={submitText}
                        cancelButtonVariant={cancelButtonVariant}
                        submitButtonVariant={submitButtonVariant}
                        submitButtonClassName={submitButtonClassName}
                        cancelButtonClassName={cancelButtonClassName}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        onOptional={onOptional}
                    />
                )}
            </DrawerContainer>
            <DrawerBackdrop couldCloseOnBackdrop={couldCloseOnBackdrop} onClose={onClose} />
        </>
    );
};

const Drawer: FC<DrawerProps> = ({ isOpen, ...rest }) => {
    if (!isOpen) return null;
    return <DrawerInner isOpen={isOpen} {...rest} />;
};

export default Drawer;
