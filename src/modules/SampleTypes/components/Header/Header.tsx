// libs
import React, { FC } from "react";
import { observer } from "mobx-react";

// stores
import { useSampleTypesStore } from "../../store";

// models
import { SampleTypeAction } from "../../models";

// constants
import { schema } from "./schema";

// components
import Filters from "./components/Filters/Filters";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header: FC = () => {
    const {
        sampleTypesStore: { sampleTypesFilters, setupSampleTypeAction },
    } = useSampleTypesStore();

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold whitespace-nowrap">Sample types</h2>
            <div className="w-full flex items-center justify-end">
                <FormContainer
                    shouldShowConfirmationDialog={false}
                    onSubmit={() => {}}
                    defaultValues={sampleTypesFilters}
                    schema={schema}
                    autoComplete="off"
                    className="w-full mr-8"
                >
                    <FilterFormValuesUpdater defaultValues={sampleTypesFilters}>
                        <Filters />
                    </FilterFormValuesUpdater>
                </FormContainer>
                <SolidButton
                    data-testid="add-sample-type-button"
                    variant="primary"
                    text="Create sample type"
                    size="sm"
                    type="button"
                    onClick={() => setupSampleTypeAction(SampleTypeAction.CREATE)}
                    className="whitespace-nowrap"
                />
            </div>
        </div>
    );
};

export default observer(Header);
