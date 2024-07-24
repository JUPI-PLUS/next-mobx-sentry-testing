import ExaminationsList from "../ExaminationsList";
import { observer } from "mobx-react";
import TemplatesFilters from "./components/TemplatesFilters/TemplatesFilters";
import StepperSummary from "../StepperSummary/StepperSummary";
import { useCreateOrderStore } from "../../../../store";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";

const CreateOrderFirstStep = () => {
    const {
        createOrderStore: {
            selectedExamTemplatesUUID,
            isSelectedExamsFetching,
            selectedKitsUUID,
            resetSelectedTemplates,
        },
    } = useCreateOrderStore();

    const isAnythingSelected = Boolean(selectedKitsUUID.size || selectedExamTemplatesUUID.size);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="max-w-2xl mx-auto w-full flex justify-center">
                <TemplatesFilters />
            </div>
            <div className="max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-end">
                    <p className="mt-7 mb-3 font-bold">Examinations</p>
                    {isAnythingSelected && (
                        <TextButton
                            text="Reset"
                            size="thin"
                            variant="neutral"
                            className="text-sm font-medium cursor-pointer mb-3"
                            onClick={resetSelectedTemplates}
                        />
                    )}
                </div>
            </div>
            <div className="h-full w-full overflow-hidden max-w-2xl mx-auto pb-4">
                <div className="overflow-auto h-full">
                    <ExaminationsList />
                </div>
            </div>
            <StepperSummary isDisabled={!isAnythingSelected || isSelectedExamsFetching} />
        </div>
    );
};

export default observer(CreateOrderFirstStep);
