// libs
import React, { FC } from "react";
import { observer } from "mobx-react";

// stores
import { useMeasureUnitsStore } from "../../store";

// models
import { MeasureUnitAction } from "../../models";

// constants
import { schema } from "./schema";

// components
import Filters from "./components/Filters/Filters";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header: FC = () => {
    const {
        measureUnitsStore: { measureUnitsFilters, setupMeasureUnitAction },
    } = useMeasureUnitsStore();

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold whitespace-nowrap">Measure units</h2>
            <div className="w-full flex items-center justify-end">
                <FormContainer
                    shouldShowConfirmationDialog={false}
                    onSubmit={() => {}}
                    defaultValues={measureUnitsFilters}
                    schema={schema}
                    autoComplete="off"
                    className="w-full mr-8"
                >
                    <FilterFormValuesUpdater defaultValues={measureUnitsFilters}>
                        <Filters />
                    </FilterFormValuesUpdater>
                </FormContainer>
                <SolidButton
                    data-testid="add-measure-unit-button"
                    variant="primary"
                    text="Create measure unit"
                    size="sm"
                    type="button"
                    onClick={() => setupMeasureUnitAction(MeasureUnitAction.CREATE)}
                    className="whitespace-nowrap"
                />
            </div>
        </div>
    );
};

export default observer(Header);
