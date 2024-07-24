// libs
import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

// helpers
import { toLookupList } from "../../shared/utils/lookups";
import { getExamTemplateStatuses, getMeasurementUnits, getParameterViewTypes } from "../../api/dictionaries";
import { getRouteHash } from "../../shared/utils/routing";

// stores
import { ParameterActionsEnum, useParametersStore } from "./store";

// api
import { getParameter } from "../../api/parameters";

// models
import { CommonDictionaryItem } from "../../shared/models/dictionaries";
import { ParameterViewTypeEnum } from "../../shared/models/business/enums";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS, PARAMETER_QUERY_KEYS } from "../../shared/constants/queryKeys";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { HeaderSkeleton, ParametersTableSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    ssr: false,
    loading: () => <HeaderSkeleton />,
});
const DynamicParametersTable = dynamic(() => import("./components/ParametersTable/ParametersTable"), {
    ssr: false,
    loading: () => <ParametersTableSkeleton />,
});

const executeRequestLookups = async (): Promise<[Lookup<ID>[], Lookup<ParameterViewTypeEnum>[], Lookup<ID>[]]> => {
    const [measurementUnits, parameterViewTypes, examTemplateStatuses] = await Promise.all([
        getMeasurementUnits(),
        getParameterViewTypes(),
        getExamTemplateStatuses(),
    ]);

    return [
        toLookupList(measurementUnits.data.data),
        toLookupList<Lookup<ParameterViewTypeEnum>, CommonDictionaryItem, ParameterViewTypeEnum>(
            parameterViewTypes.data.data
        ),
        toLookupList(examTemplateStatuses.data.data),
    ];
};

const ParametersModule = () => {
    const { asPath } = useRouter();

    const {
        parametersStore: {
            setupMeasurementUnits,
            setupParameterTypes,
            setupExaminationTemplateStatusesLookup,
            setupParameterAction,
            setupSelectedParameter,
            initialize,
            cleanup,
        },
    } = useParametersStore();

    const parameterUUIDHash = getRouteHash(asPath);

    const { data: lookups = [[], [], []], isFetching } = useQuery(
        [
            DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS,
            DICTIONARIES_QUERY_KEYS.PARAMETER_TYPES,
            DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        ],
        executeRequestLookups,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
        }
    );

    useQuery(PARAMETER_QUERY_KEYS.DETAILS(parameterUUIDHash), getParameter(parameterUUIDHash), {
        enabled: Boolean(parameterUUIDHash) && !isFetching,
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            setupParameterAction(ParameterActionsEnum.EDIT);
            setupSelectedParameter(queryData);
        },
    });

    useEffect(() => {
        if (isFetching) return;
        const [measurementUnits, parameterViewTypes, examTemplateStatuses] = lookups;
        setupMeasurementUnits(measurementUnits);
        setupParameterTypes(parameterViewTypes);
        setupExaminationTemplateStatusesLookup(examTemplateStatuses);
    }, [isFetching, lookups]);

    useEffect(() => {
        initialize();
        return cleanup;
    }, []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-tablePage overflow-hidden pt-6 h-full max-h-full">
            <div className="px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <ErrorBoundary>
                    <Suspense fallback={<ParametersTableSkeleton />}>
                        <DynamicParametersTable />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(ParametersModule);
