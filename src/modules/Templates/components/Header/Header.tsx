// libs
import { observer } from "mobx-react";
import React from "react";
import { object } from "yup";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { useTemplatesStore } from "../../store";

// components
import Filters from "./components/Filters/Filters";

const Header = () => {
    const {
        templatesStore: { templatesFilters },
    } = useTemplatesStore();

    return (
        <FormContainer
            shouldShowConfirmationDialog={false}
            onSubmit={() => {}}
            defaultValues={templatesFilters}
            schema={object().shape({})}
            autoComplete="off"
            className="flex justify-between items-center gap-4"
        >
            <h2 className="text-2xl font-bold whitespace-nowrap">Constructor / Templates</h2>
            <Filters />
        </FormContainer>
    );
};

export default observer(Header);
