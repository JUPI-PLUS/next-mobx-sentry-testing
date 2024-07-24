import React, { FC } from "react";
import FormDrawer from "../../../../components/uiKit/Drawer/FormDrawer";
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";
import { useQuery } from "react-query";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { getOrganizations, getPositions } from "../../../../api/dictionaries";
import { toLookupList } from "../../../../shared/utils/lookups";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { schema } from "./schema";
import { MakeStaffDrawerProps } from "../ShortInfo/components/StaffManagment/models";

const OrganizationDrawer: FC<MakeStaffDrawerProps> = ({ isOpen, onClose, onSubmit, defaultValues }) => {
    const { data: organizations = [], isFetching: isOrganizationsFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.ORGANIZATIONS,
        getOrganizations,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const { data: positions = [], isFetching: isPositionsFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.POSITIONS,
        getPositions,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    return (
        <FormDrawer
            title="Make a staff"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            schema={schema}
            side="right"
            size="md"
            submitText="Submit"
            cancelText="Cancel"
            disableOnCleanFields
        >
            <>
                <FormSelect
                    options={organizations}
                    name="organization"
                    label="Organizations"
                    isLoading={isOrganizationsFetching}
                />
                <FormSelect
                    options={positions}
                    name="position"
                    label="Position"
                    className="mt-3"
                    isLoading={isPositionsFetching}
                />
            </>
        </FormDrawer>
    );
};

export default OrganizationDrawer;
