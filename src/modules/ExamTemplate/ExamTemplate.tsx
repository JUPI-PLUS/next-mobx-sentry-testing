// libs
import React, { FC, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import isNull from "lodash/isNull";

// helpers
import { getExamTemplateInfo, getExamTemplateParams } from "../../api/examTemplates";
import { getExamTemplateStatuses, getMeasurementUnits, getSampleTypes } from "../../api/dictionaries";
import { getLookupItem, toLookupList } from "../../shared/utils/lookups";
import { modifyParametersData } from "./helpers";

// stores
import { useExamTemplateStore } from "./store";
import { useTemplatesStore } from "../Templates/store";

// models
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";

// constants
import { DICTIONARIES_QUERY_KEYS, EXAM_TEMPLATE_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../shared/constants/queries";
import { DEFAULT_EXAM_TEMPLATE_STATUS_ID, EXAM_TEMPLATE_DEFAULT_VALUES, EXAM_TEMPLATE_TITLES } from "./constants";

// components
import Stepper from "../../components/uiKit/Steppers/Stepper/Stepper";
import ExamParameters from "./components/ExamTemplateParameters/ExamTemplateParameters";
import ExamGeneralInfo from "./components/ExamTemplateGeneralInfo/ExamTemplateInfo";

const executeExamTemplateLookupQueries = async (): Promise<Lookup<ID>[][]> => {
    const [sampleTypes, measurementUnits, examTemplateStatuses] = await Promise.all([
        getSampleTypes(),
        getMeasurementUnits(),
        getExamTemplateStatuses(),
    ]);

    return [
        toLookupList(sampleTypes.data.data),
        toLookupList(measurementUnits.data.data),
        toLookupList(examTemplateStatuses.data.data),
    ];
};

const ExamTemplate: FC<{ uuid?: string }> = ({ uuid }) => {
    const {
        templatesStore: { copiedExamTemplateUUID, cleanupExamTemplate },
    } = useTemplatesStore();

    const {
        examTemplateStore: {
            examTemplateInfo,
            setupExamTemplateInfo,
            setupExamTemplateParameters,
            setupExamTemplateDictionaries,
            activeStep,
            setupExamTemplateUUID,
            cleanup,
        },
    } = useExamTemplateStore();

    const examTemplateUUID = uuid || copiedExamTemplateUUID;

    const stepperTitles = useMemo(() => Object.values(EXAM_TEMPLATE_TITLES), []);

    const { data: [sampleTypesLookup, measurementUnitsLookup, examTemplateStatusesLookup] = [[], [], []], isFetching } =
        useQuery(
            [
                DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
                DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS,
                DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
            ],
            executeExamTemplateLookupQueries,
            {
                staleTime: DEFAULT_LOOKUP_STALE_TIME,
                onSuccess: ([sampleTypes, measurementUnits, examTemplateStatuses]) => {
                    setupExamTemplateDictionaries({
                        sampleTypesLookup: sampleTypes,
                        measurementUnitsLookup: measurementUnits,
                        examTemplateStatusesLookup: examTemplateStatuses,
                    });
                },
            }
        );

    const { isLoading: isLoadingInfo } = useQuery(
        EXAM_TEMPLATE_QUERY_KEYS.INFO(examTemplateUUID),
        getExamTemplateInfo(examTemplateUUID),
        {
            enabled: Boolean(examTemplateUUID) && !isFetching,
            refetchOnWindowFocus: false,
            onSuccess: queryData => {
                const templateInfo = queryData.data.data;

                setupExamTemplateInfo({
                    ...templateInfo,
                    term: String(templateInfo.term),
                    sample_types_id: getLookupItem(sampleTypesLookup, templateInfo.sample_types_id),
                    si_measurement_units_id: getLookupItem(
                        measurementUnitsLookup,
                        templateInfo.si_measurement_units_id
                    ),
                    volume: String(templateInfo.volume),
                    status_id: getLookupItem(examTemplateStatusesLookup, templateInfo.status_id)!,
                    preparation: templateInfo.preparation || "",
                    description: templateInfo.description || "",
                    sample_prefix: isNull(templateInfo.sample_prefix) ? "" : String(templateInfo.sample_prefix),
                });

                !copiedExamTemplateUUID && setupExamTemplateUUID(examTemplateUUID);
            },
        }
    );

    const { isLoading: isLoadingParams } = useQuery(
        EXAM_TEMPLATE_QUERY_KEYS.PARAMS(examTemplateUUID),
        getExamTemplateParams(examTemplateUUID),
        {
            enabled: Boolean(examTemplateUUID),
            refetchOnWindowFocus: false,
            onSuccess: queryData => {
                let parametersData = queryData.data.data;
                if (copiedExamTemplateUUID) {
                    parametersData = modifyParametersData(parametersData);
                }
                setupExamTemplateParameters(parametersData);
            },
        }
    );

    useEffect(() => {
        if (!Boolean(examTemplateUUID) && !isFetching) {
            setupExamTemplateInfo({
                ...EXAM_TEMPLATE_DEFAULT_VALUES,
                status_id: getLookupItem(examTemplateStatusesLookup, DEFAULT_EXAM_TEMPLATE_STATUS_ID)!,
            });
        }
    }, [examTemplateUUID, isFetching]);

    useEffect(
        () => () => {
            // To work correctly, change `reactStrictMode` in next.config.js to `false`
            cleanupExamTemplate();
            cleanup();
        },
        []
    );

    return (
        <Stepper
            containerClassName="grid grid-rows-autoFr h-full max-w-3xl mx-auto"
            titles={stepperTitles}
            activeStep={activeStep}
            isLoading={isLoadingInfo || isLoadingParams || !examTemplateInfo}
        >
            <ExamGeneralInfo />
            <ExamParameters />
        </Stepper>
    );
};

export default observer(ExamTemplate);
