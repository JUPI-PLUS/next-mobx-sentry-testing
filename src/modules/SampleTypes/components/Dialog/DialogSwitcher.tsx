// libs
import { observer } from "mobx-react";

// stores
import { useSampleTypesStore } from "../../store";

// models
import { SampleTypeAction } from "../../models";

// components
import DeleteDialog from "./DeleteDialog/DeleteDialog";
import FormCreateSampleTypeDrawer from "../../../../components/SampleTypeDrawers/FormCreateSampleTypeDrawer/FormCreateSampleTypeDrawer";
import FormEditSampleTypeDrawerContainer from "../../../../components/SampleTypeDrawers/FormEditSampleTypeDrawer/FormEditSampleTypeDrawerContainer";

const DialogSwitcher = () => {
    const {
        sampleTypesStore: { sampleType, sampleTypeAction },
    } = useSampleTypesStore();

    switch (sampleTypeAction) {
        case SampleTypeAction.DELETE:
            return <DeleteDialog />;
        case SampleTypeAction.EDIT:
            if (!sampleType) return null;

            return <FormEditSampleTypeDrawerContainer sampleType={sampleType} />;
        case SampleTypeAction.CREATE:
            return <FormCreateSampleTypeDrawer />;
        default:
            return null;
    }
};

export default observer(DialogSwitcher);
