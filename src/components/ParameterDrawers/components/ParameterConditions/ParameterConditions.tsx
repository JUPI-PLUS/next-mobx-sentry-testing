// libs
import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useParameterConditionsStore } from "./store";

// query keys
import { DICTIONARIES_QUERY_KEYS, PARAMETER_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// api
import { getConditionTypes, getReferenceColors } from "../../../../api/dictionaries";
import { getParameterConditions } from "../../../../api/parameters";

// helpers
import { toLookupList } from "../../../../shared/utils/lookups";

// components
import ConditionGroup from "./components/ConditionGroup/ConditionGroup";

// models
import { ParameterConditionsProps, ParameterConditionTypeDictionaryItemLookup } from "./models";

const ParameterConditions: FC<ParameterConditionsProps> = ({ parameterUUID, parameterName, isEdit = false }) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            setupInitialConditions,
            setupConditionTypesLookup,
            setupReferenceColorsLookup,
            setupIsConditionsFetched,
        },
    } = useParameterConditionsStore();

    useQuery(PARAMETER_QUERY_KEYS.CONDITIONS(parameterUUID!), getParameterConditions(parameterUUID!), {
        enabled: isEdit && Boolean(parameterUUID),
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            setupInitialConditions(queryData);
            setupIsConditionsFetched();
        },
    });

    const { data: conditionTypesLookup = [] } = useQuery(DICTIONARIES_QUERY_KEYS.CONDITION_TYPES, getConditionTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList<ParameterConditionTypeDictionaryItemLookup>(queryData.data.data, true),
    });

    const { data: referenceColorsLookup = [] } = useQuery(
        DICTIONARIES_QUERY_KEYS.REFERENCE_COLORS,
        getReferenceColors,
        {
            refetchOnWindowFocus: false,
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    useEffect(() => {
        if (conditionTypesLookup.length) {
            setupConditionTypesLookup(conditionTypesLookup);
        }
    }, [conditionTypesLookup]);

    useEffect(() => {
        if (referenceColorsLookup.length) {
            setupReferenceColorsLookup(referenceColorsLookup);
        }
    }, [referenceColorsLookup]);

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">{parameterName}</h2>
            {conditionGroups.map(({ id, isDefault }, index) => (
                <ConditionGroup key={id} id={id} isDefault={isDefault} index={index} />
            ))}
        </div>
    );
};

export default observer(ParameterConditions);
