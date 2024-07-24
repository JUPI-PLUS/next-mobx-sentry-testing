import FormContainer from "../../../../../../../../components/uiKit/forms/FormContainer/FormContainer";
import { useCreateOrderStore } from "../../../../../../store";
import { observer } from "mobx-react";
import { schema } from "./schema";
import TemplatesFilterInput from "./components/TemplatesFilterInput/TemplatesFilterInput";

const TemplatesFilters = () => {
    const {
        createOrderStore: { templatesFilters, setupTemplateFilters },
    } = useCreateOrderStore();

    return (
        <FormContainer
            shouldShowConfirmationDialog={false}
            onSubmit={() => {}}
            defaultValues={templatesFilters}
            schema={schema}
            autoComplete="off"
            className="flex-auto"
        >
            <TemplatesFilterInput
                name="name"
                placeholder="Filter"
                onChange={value => setupTemplateFilters("name", value)}
                data-testid="users-filter-uuid"
                className="mb-3"
            />
        </FormContainer>
    );
};

export default observer(TemplatesFilters);
