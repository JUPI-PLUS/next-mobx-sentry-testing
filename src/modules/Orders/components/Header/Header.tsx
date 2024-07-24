import React, { useEffect, useMemo } from "react";
import Filters from "./components/Filters/Filters";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { object } from "yup";
import { useOrdersStore } from "../../store";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { ServerResponse } from "../../../../shared/models/axios";
import { OrderStatusDictionaryItem } from "../../../../shared/models/dictionaries";
import { AxiosError } from "axios";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { getOrderStatuses } from "../../../../api/dictionaries";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header = () => {
    const {
        ordersStore: { activeOrdersFilter, setupOrderStatusesLookup },
    } = useOrdersStore();

    const { data: orderStatusesLookup = [] } = useQuery<
        ServerResponse<OrderStatusDictionaryItem[]>,
        AxiosError,
        Lookup<ID>[]
    >(DICTIONARIES_QUERY_KEYS.ORDER_STATUSES, getOrderStatuses, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const defaultValues = useMemo(
        () => ({
            ...activeOrdersFilter,
            status: getLookupItem(orderStatusesLookup, activeOrdersFilter.status) || null,
        }),
        [activeOrdersFilter, orderStatusesLookup]
    );

    useEffect(() => {
        orderStatusesLookup.length && setupOrderStatusesLookup(orderStatusesLookup);
    }, [orderStatusesLookup]);

    const onSubmit = () => {};

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Orders</h2>
            <FormContainer
                shouldShowConfirmationDialog={false}
                onSubmit={onSubmit}
                defaultValues={defaultValues}
                schema={object().shape({})}
                autoComplete="off"
                className="w-full"
            >
                <FilterFormValuesUpdater defaultValues={defaultValues}>
                    <Filters />
                </FilterFormValuesUpdater>
            </FormContainer>
        </div>
    );
};

export default observer(Header);
