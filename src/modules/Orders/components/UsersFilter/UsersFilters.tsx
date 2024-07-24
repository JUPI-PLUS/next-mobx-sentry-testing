// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useOrdersStore } from "../../store";

// helpers
import schema from "./schema";

// components
import UsersFilterForm from "./UsersFilterForm";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";

const UsersFilters = () => {
    const {
        ordersStore: { activeUsersFilter },
    } = useOrdersStore();
    const onSubmit = () => {};

    return (
        <div className="mb-4">
            <FormContainer
                shouldShowConfirmationDialog={false}
                onSubmit={onSubmit}
                defaultValues={activeUsersFilter}
                schema={schema}
            >
                <UsersFilterForm />
            </FormContainer>
        </div>
    );
};

export default observer(UsersFilters);
