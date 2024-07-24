// libs
import { observer } from "mobx-react";

// stores
import { useMeasureUnitsStore } from "../../store";

// models
import { MeasureUnitAction } from "../../models";

// components
import DeleteDialog from "./DeleteDialog/DeleteDialog";
import CreateDialog from "./CreateDialog/CreateDialog";
import EditDialog from "./EditDialog/EditDialog";

const DialogSwitcher = () => {
    const {
        measureUnitsStore: { measureUnitAction },
    } = useMeasureUnitsStore();

    switch (measureUnitAction) {
        case MeasureUnitAction.DELETE:
            return <DeleteDialog />;
        case MeasureUnitAction.EDIT:
            return <EditDialog />;
        case MeasureUnitAction.CREATE:
            return <CreateDialog />;
        default:
            return null;
    }
};

export default observer(DialogSwitcher);
