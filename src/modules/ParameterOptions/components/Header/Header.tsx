// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useParameterOptionsStore } from "../../store";

// helpers
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { schema } from "./schema";

// components
import CreateParameterOption from "../CreateParameterOption/CreateParameterOption";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import Filters from "./components/Filters/Filters";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        parameterOptionsStore: { parameterOptionsFilters },
    } = useParameterOptionsStore();

    const onSubmit = () => {};

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold whitespace-nowrap">Parameter options</h2>
            <div className="w-full flex items-center justify-end">
                <FormContainer
                    shouldShowConfirmationDialog={false}
                    onSubmit={onSubmit}
                    defaultValues={parameterOptionsFilters}
                    schema={schema}
                    autoComplete="off"
                    className="w-full mr-8"
                >
                    <FilterFormValuesUpdater defaultValues={parameterOptionsFilters}>
                        <Filters />
                    </FilterFormValuesUpdater>
                </FormContainer>
                <SolidButton
                    data-testid="create-option-button"
                    variant="primary"
                    text="Create option"
                    size="sm"
                    type="button"
                    onClick={onOpen}
                    className="whitespace-nowrap"
                />
            </div>
            <CreateParameterOption isOpen={isOpen} onClose={onClose} />
        </div>
    );
};

export default observer(Header);
