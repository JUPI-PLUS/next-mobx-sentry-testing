import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { ROLES_FILTERS_DEFAULT_VALUES } from "../../store";
import RolesFiltersForm from "./RolesFiltersForm/RolesFiltersForm";
import { schema } from "./schema";

const RolesFilters = () => {
    const onSubmit = () => {};

    return (
        <div className="mb-4">
            <FormContainer
                shouldShowConfirmationDialog={false}
                defaultValues={ROLES_FILTERS_DEFAULT_VALUES}
                schema={schema}
                onSubmit={onSubmit}
            >
                <RolesFiltersForm />
            </FormContainer>
        </div>
    );
};

export default RolesFilters;
