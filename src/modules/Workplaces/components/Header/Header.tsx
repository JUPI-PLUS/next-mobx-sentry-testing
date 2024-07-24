// libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useWorkplacesStore } from "../../store";

// api
import { getExamTemplates } from "../../../../api/dictionaries";

// helpers
import { schema } from "./schema";
import { toLookupList } from "../../../../shared/utils/lookups";

// constants
import { ROUTES } from "../../../../shared/constants/routes";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import Filters from "./components/Filters/Filters";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header = () => {
    const {
        workplacesStore: { activeWorkplaceFilters, setupExamTemplatesLookup },
    } = useWorkplacesStore();

    const { data: examTemplates } = useQuery(DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATES, getExamTemplates, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    useEffect(() => examTemplates && setupExamTemplatesLookup(examTemplates), [examTemplates]);

    const onSubmit = () => {};

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold whitespace-nowrap">Workplaces</h2>
            <div className="w-full flex items-start justify-end">
                <FormContainer
                    shouldShowConfirmationDialog={false}
                    onSubmit={onSubmit}
                    defaultValues={activeWorkplaceFilters}
                    schema={schema}
                    autoComplete="off"
                    className="w-full"
                >
                    <FilterFormValuesUpdater defaultValues={activeWorkplaceFilters}>
                        <Filters />
                    </FilterFormValuesUpdater>
                </FormContainer>
                <div className="w-px bg-dark-400 mx-4 mt-1 h-8" />
                <LinkComponent href={{ pathname: ROUTES.workplaces.create.route }}>
                    <SolidButton
                        data-testid="create-workplace-button"
                        variant="primary"
                        text="Create workplace"
                        type="button"
                        size="sm"
                        className="whitespace-nowrap"
                    />
                </LinkComponent>
            </div>
        </div>
    );
};

export default observer(Header);
