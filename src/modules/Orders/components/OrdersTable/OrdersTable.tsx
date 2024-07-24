// libs
import React, { Suspense, useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useQuery, QueryKey } from "react-query";
import dynamic from "next/dynamic";
import fromUnixTime from "date-fns/fromUnixTime";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { stringify } from "query-string";

// stores
import { useOrdersStore } from "../../store";
import { useRootStore } from "../../../../shared/store";
import { useTableStore } from "../../../../components/Table/store";

// api
import { getOrderList } from "../../../../api/orders";
import { details } from "../../../../api/users";

// helpers
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";
import { getLookupItem } from "../../../../shared/utils/lookups";

// models
import { ServerResponseType } from "../../../../shared/models/axios";
import { Order, OrderStatus } from "../../../../shared/models/business/order";
import { CustomColumn } from "../../../../components/Table/models";
import { OrdersPermission, ProfilePermission } from "../../../../shared/models/permissions";

// constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { PATIENTS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_TIMEZONE } from "../../../../shared/constants/timezones";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../../shared/constants/user";

// components
import Table from "../../../../components/Table";
import OrderNumberCell from "./components/OrderNumberCell/OrderNumberCell";
import ActionsCell from "./components/ActionsCell/ActionsCell";
import StatusCell from "./components/StatusCell/StatusCell";
import TextCell from "../../../../components/Table/components/TextCell/TextCell";
import Badge from "../../../../components/uiKit/Badge/Badge";

const DynamicOrderUserDetails = dynamic(() => import("../OrderUserDetails/OrderUserDetails"), {
    ssr: false,
});

const OrdersTable = () => {
    const { query } = useRouter();
    const {
        ordersStore: {
            ordersFiltersQueryString,
            setupActiveUser,
            setupOrderFilter,
            activeOrdersFilter,
            setupOrderFilterFromQueries,
            orderStatusesLookup,
            resetOrdersFilter,
            tableService: { areFiltersInitialized },
        },
    } = useOrdersStore();

    const {
        user: { uuid: userUUID },
    } = useRootStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    const hasAbilityToViewUser = usePermissionsAccess([OrdersPermission.CREATE, ProfilePermission.VIEW_ONE], true);
    const isOrderDetailsAllowed = usePermissionsAccess([OrdersPermission.VIEW_ONE]);
    const isSelfCreatedDetailsAllowed = usePermissionsAccess([OrdersPermission.VIEW_ONE_SELF_CREATED]);

    const columns: CustomColumn<Order>[] = [
        {
            id: "order_number",
            accessorKey: "order_number",
            header: "Order №",
            maxWidth: 200,
            cell: ({ row }) => (
                <OrderNumberCell
                    orderNumber={row.original.order_number}
                    orderUUID={row.original.uuid}
                    isLinkAllowed={
                        isOrderDetailsAllowed || (isSelfCreatedDetailsAllowed && row.original.creator_uuid === userUUID)
                    }
                />
            ),
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            maxWidth: 200,
            cell: ({ getValue }) => {
                const status = getValue() as OrderStatus;
                return <StatusCell status={status} text={getLookupItem(orderStatusesLookup, status)?.label ?? ""} />;
            },
        },
        {
            id: "created_at_timestamp",
            accessorKey: "created_at_timestamp",
            header: "Created at",
            maxWidth: 300,
            cell: ({ getValue }) => (
                <TextCell
                    text={formatInTimeZone(
                        fromUnixTime(getValue() as number),
                        DEFAULT_TIMEZONE,
                        DATE_FORMATS.DATETIME_PICKER_VALUE
                    )}
                />
            ),
        },
        {
            id: "first_name",
            accessorKey: "first_name",
            header: "First name",
            cell: ({ row }) =>
                row.original.first_name ? (
                    <TextCell text={row.original.first_name} />
                ) : (
                    <Badge text={DEFAULT_DELETED_USER_MOCK_TEXT} variant="neutral" />
                ),
        },
        {
            id: "last_name",
            accessorKey: "last_name",
            header: "Last name",
            cell: ({ row }) =>
                row.original.last_name ? (
                    <TextCell text={row.original.last_name} />
                ) : (
                    <Badge text={DEFAULT_DELETED_USER_MOCK_TEXT} variant="neutral" />
                ),
        },
        {
            id: "referral_doctor",
            accessorKey: "referral_doctor",
            header: "Referral doctor",
            cell: ({ row }) => <TextCell text={row.original.referral_doctor} />,
        },
        {
            id: "exams",
            accessorKey: "number_of_exams",
            header: "Exams",
            maxWidth: 80,
        },
        {
            id: "actions",
            maxWidth: 80,
            cell: ({ row }) => (
                <ActionsCell
                    orderNumber={row.original.order_number}
                    orderUUID={row.original.uuid}
                    orderStatus={row.original.status}
                    isPatientDeleted={!Boolean(row.original.first_name)}
                    onSelectPatient={() => setupOrderFilter("user_uuid", row.original.user_uuid)}
                />
            ),
        },
    ];

    useQuery(PATIENTS_QUERY_KEYS.PATIENT(activeOrdersFilter.user_uuid), details(activeOrdersFilter.user_uuid), {
        enabled: hasAbilityToViewUser && Boolean(activeOrdersFilter.user_uuid),
        select: queryData => queryData.data.data,
        onSuccess: queryPatientData => {
            setupActiveUser({
                ...queryPatientData,
                birth_date_at_timestamp: queryPatientData.birth_date,
            });
        },
    });

    useEffect(() => {
        const { user_uuid: uuid, ...restQueryProperties } = query;
        const parsedQueries = setupOrderFilterFromQueries(
            stringify(hasAbilityToViewUser ? query : restQueryProperties)
        );
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<Order, "list">> => {
            const response = await getOrderList(page, ordersFiltersQueryString);
            return response.data;
        },
        [ordersFiltersQueryString]
    );

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
            <Suspense>
                <DynamicOrderUserDetails />
            </Suspense>
            <Table<Order>
                tableName="orders"
                fetchCallback={fetchCallback}
                onError={resetOrdersFilter}
                filters={ordersFiltersQueryString}
                columns={columns}
                isFetchEnabled={areFiltersInitialized}
            />
        </div>
    );
};

export default observer(OrdersTable);
