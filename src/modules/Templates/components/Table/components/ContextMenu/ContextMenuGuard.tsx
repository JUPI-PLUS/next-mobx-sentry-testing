// libs
import { FC } from "react";
import { observer } from "mobx-react";

// stores
import { useContextMenuStore } from "./store";
import { useTemplatesStore } from "../../../../store";

// components
import ContextMenu from "./ContextMenu";

const ContextMenuGuard: FC = () => {
    const {
        contextMenuStore: { contextMenuTemplate },
    } = useContextMenuStore();
    const {
        templatesStore: { cutItemDetails },
    } = useTemplatesStore();

    if (!contextMenuTemplate || cutItemDetails) return null;

    return <ContextMenu />;
};

export default observer(ContextMenuGuard);
