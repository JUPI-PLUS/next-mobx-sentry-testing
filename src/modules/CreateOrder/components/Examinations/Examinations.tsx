// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useCreateOrderStore } from "../../store";

// constants
import { ADD_ORDER_STEP_TITLES } from "./components/constants";

// components
import SelectableStepper from "../../../../components/uiKit/Steppers/SelectableStepper/SelectableStepper";
import CreateOrderFirstStep from "./components/CreateOrderFirstStep/CreateOrderFirstStep";
import CreateOrderSecondStep from "./components/CreateOrderSecondStep/CreateOrderSecondStep";

const Examinations = () => {
    const {
        createOrderStore: { activeStep, setActiveStep, selectedKitExamTemplates },
    } = useCreateOrderStore();

    return (
        <SelectableStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            titles={Object.values(ADD_ORDER_STEP_TITLES)}
            headerClassName="mt-8 mb-14 mx-auto max-w-xs w-full"
            isNextStepsDisabled={!Boolean(selectedKitExamTemplates.size)}
        >
            <div className="h-full row-span-4">
                <CreateOrderFirstStep />
            </div>
            <div className="h-full row-span-4">
                <CreateOrderSecondStep />
            </div>
        </SelectableStepper>
    );
};

export default observer(Examinations);
