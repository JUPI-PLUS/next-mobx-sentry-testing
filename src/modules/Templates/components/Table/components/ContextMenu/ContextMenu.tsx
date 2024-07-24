// libs
import { FC, useRef } from "react";
import { observer } from "mobx-react";

// components
import Dropdown from "../../../../../../components/uiKit/Dropdown/Dropdown";
import { useContextMenuStore } from "./store";
import { useClickAway } from "../../../../../../shared/hooks/useClickAway";
import { useDropdownItems } from "../Cells/ActionsCell/useDropdownItems";

const ContextMenu: FC = () => {
    const {
        contextMenuStore: { cleanup, contextMenuTemplate, position, dropdownDirection, transform },
    } = useContextMenuStore();
    const ref = useRef(null);

    useClickAway(ref, cleanup);

    const dropdownItems = useDropdownItems(contextMenuTemplate!, cleanup);

    return (
        <ul
            ref={ref}
            className="py-3 bg-white shadow-dropdown rounded-md min-w-32"
            style={{
                ...position,
                position: "absolute",
                transform,
            }}
        >
            {dropdownItems.map(item => (
                <Dropdown key={item.title} direction={dropdownDirection} {...item} />
            ))}
        </ul>
    );
};

export default observer(ContextMenu);
