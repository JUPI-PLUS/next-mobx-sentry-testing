// libs
import React, { FC, useState } from "react";

// helpers
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

// models
import { MenuProps } from "./models";

// components
import MenuList from "./components/MenuList/MenuList";
import MenuToggleButton from "./components/MenuToggleButton/MenuToggleButton";

const OPEN_MENU_DELAY = 250;
let timerId: null | ReturnType<typeof setTimeout> = null;

const Menu: FC<MenuProps> = ({ toggle, isMenuToggled }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [isStatic, setIsStatic] = useState(true);

    const onMouseEnter = async () => {
        await new Promise(resolve => {
            timerId = setTimeout(resolve, OPEN_MENU_DELAY);
        }).then(() => {
            if (isMenuToggled || isOpen || !timerId) return;
            setIsStatic(false);
            onOpen();
        });
    };

    const onMouseOver = async () => {
        if (isMenuToggled || isOpen) return;
        await onMouseEnter();
    };

    const onMouseLeave = () => {
        timerId && clearTimeout(timerId);
        timerId = null;
        if (isMenuToggled && isStatic) return;
        setIsStatic(true);
        onClose();
    };

    const isMenuOpen = isOpen || isMenuToggled;
    const menuWidth = isMenuOpen ? "w-72" : "w-20";

    return (
        <aside className={`${menuWidth} absolute h-menu z-40`}>
            <div
                className={`transition-all duration-300 ease-in-out shadow-menu overflow-y-auto pb-5 bg-white flex flex-col 
                ${menuWidth} ${isStatic ? "static h-full" : "fixed top-menu bottom-0"}`}
            >
                <div
                    onFocus={onOpen}
                    onBlur={onClose}
                    className="h-full overflow-y-hidden"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseOver={onMouseOver}
                >
                    <MenuList isOpen={isMenuOpen} />
                </div>
                <MenuToggleButton isOpen={isMenuOpen} onClick={toggle} />
            </div>
        </aside>
    );
};

export default React.memo(Menu);
