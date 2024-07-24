// libs
import { observer } from "mobx-react";

// stores
import { useTemplatesStore } from "../../store";

// components
import FormGroupNameDialog from "./FormDialog/FormGroupNameDialog/FormGroupNameDialog";
import DeleteDialog from "./DeleteDialog/DeleteDialog";
import FormAddDialog from "./FormDialog/FormAddDialog/FormAddDialog";
import { DialogTypeEnum } from "../../models";
import MoveDialog from "./MoveDialog/MoveDialog";

const DialogSwitcher = () => {
    const {
        templatesStore: { dialogType },
    } = useTemplatesStore();

    switch (dialogType) {
        case DialogTypeEnum.GROUP_NAME:
            return <FormGroupNameDialog />;
        case DialogTypeEnum.DELETE:
            return <DeleteDialog />;
        case DialogTypeEnum.ADD:
            return <FormAddDialog />;
        case DialogTypeEnum.MOVE:
            return <MoveDialog />;
        default:
            return null;
    }
};

export default observer(DialogSwitcher);
