// libs
import React, { FC, useCallback, useEffect } from "react";
import { QueryKey, useQuery } from "react-query";
import { observer } from "mobx-react";
import groupBy from "lodash/groupBy";

// stores
import { useOrderStore } from "../../store";

//  constants
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// api
import { getOrderExamsList } from "../../../../api/orders";
import { getExamStatuses, getSampleTypes } from "../../../../api/dictionaries";

// helpers
import { toLookupList } from "../../../../shared/utils/lookups";
import { prepareOrderExaminationsResponse, tableRowClassName } from "./utils";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";

// models
import { SampleActionType } from "../../../../shared/models/business/sample";
import { ExamStatusesEnum } from "../../../../shared/models/business/exam";
import { ServerResponseType } from "../../../../shared/models/axios";
import { ExaminationsTableProps, OrderExaminationRowTypeEnum, OrderExaminationTableRow } from "./models";

// components
import { CustomColumn } from "../../../../components/Table/models";
import Table from "../../../../components/Table";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import ParameterCell from "./components/Cells/ParameterCell/ParameterCell";
import SampleNumberCell from "./components/Cells/SampleNumberCell/SampleNumberCell";
import BiomaterialTypeCell from "./components/Cells/BiomaterialTypeCell/BiomaterialTypeCell";
import StatusCell from "./components/Cells/StatusCell/StatusCell";
import SamplingActionsContainer from "../SamplingActionsContainer/SamplingActionsContainer";
import TableSummary from "../TableSummary/TableSummary";

const ExaminationsTable: FC<ExaminationsTableProps> = ({ orderUUID }) => {
    const {
        orderStore: {
            setupLastRequestedQueryKey,
            setupIsSomeExamOnValidation,
            sampleActionType,
            setupExamSampleTypes,
            setupGroupedSelectedTemplates,
            orderDetails,
        },
    } = useOrderStore();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: sampleTypesLookup = [], isFetching: isSampleTypesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        getSampleTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const { data: examStatusesLookup = [], isFetching: isExamStatusesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_STATUSES,
        getExamStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const columns: CustomColumn<OrderExaminationTableRow>[] = [
        {
            id: "parameter",
            header: "Parameter",
            cell: ({ row }) => <ParameterCell row={row} />,
            maxWidth: row => {
                if (row?.type === OrderExaminationRowTypeEnum.GROUP) {
                    return "100%";
                }

                return undefined;
            },
        },
        {
            id: "sample_number",
            header: "Sample number",
            cell: ({ row }) => <SampleNumberCell row={row} userUUID={orderDetails?.user_uuid ?? ""} />,
            maxWidth: row => {
                if (row?.type === OrderExaminationRowTypeEnum.GROUP) {
                    return 0;
                }

                return "100%";
            },
        },
        {
            id: "biomaterial_type",
            header: "Biomaterial type",
            cell: ({ row }) => <BiomaterialTypeCell row={row} />,
            maxWidth: row => {
                if (row?.type === OrderExaminationRowTypeEnum.GROUP) {
                    return 0;
                }

                return "100%";
            },
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => <StatusCell row={row} />,
            maxWidth: row => {
                if (row?.type === OrderExaminationRowTypeEnum.GROUP) {
                    return 0;
                }

                return "15%";
            },
        },
    ];

    useEffect(() => {
        if (sampleTypesLookup.length && !isSampleTypesFetching) {
            setupExamSampleTypes(sampleTypesLookup);
        }
    }, [sampleTypesLookup.length, isSampleTypesFetching]);

    useEffect(() => {
        if (sampleActionType === SampleActionType.Resample) {
            onOpen();
        }
    }, [sampleActionType]);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey): Promise<ServerResponseType<OrderExaminationTableRow, "list">> => {
            const response = await getOrderExamsList(orderUUID)();

            setupIsSomeExamOnValidation(
                response.data.data.some(order => order.exam_status === ExamStatusesEnum.ON_VALIDATION)
            );

            setupLastRequestedQueryKey(queryKey);

            const groupedTemplates = groupBy(response.data.data, "kit_template_name");
            setupGroupedSelectedTemplates(groupedTemplates);

            return {
                ...response.data,
                data: prepareOrderExaminationsResponse(response.data.data, sampleTypesLookup, examStatusesLookup),
            };
        },
        [examStatusesLookup, orderUUID, sampleTypesLookup]
    );

    if (isSampleTypesFetching || isExamStatusesFetching) {
        return (
            <div className="h-full flex items-center justify-center">
                <CircularProgressLoader />
            </div>
        );
    }

    return (
        <>
            <SamplingActionsContainer
                isSamplingDrawerOpen={isOpen}
                onSamplingDrawerClose={onClose}
                orderUUID={orderUUID}
            />
            <Table<OrderExaminationTableRow>
                tableName="orders"
                fetchCallback={fetchCallback}
                columns={columns}
                showPagination={false}
                getRowClassName={tableRowClassName}
                summary={<TableSummary onDrawerOpen={onOpen} />}
            />
        </>
    );
};

export default observer(ExaminationsTable);
