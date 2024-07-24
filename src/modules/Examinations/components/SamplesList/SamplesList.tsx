// libs
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../store";

// api
import { getSampleTypes } from "../../../../api/dictionaries";
import { examinationsListOfSamples } from "../../../../api/samples";

// helpers
import { openPrintTodoListToPrint } from "./utils";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { prepareExaminationsListOfSamples } from "../../utils";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS, SAMPLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import CircularProgressLoader from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import SampleItem from "./components/SampleItem/SampleItem";
import { IconButton } from "../../../../components/uiKit/Button/Button";
import { Tooltip } from "../../../../components/uiKit/Tooltip/Tooltip";
import { PrinterIcon } from "@heroicons/react/20/solid";
import SortingControls from "./components/SortingControls/SortingControls";

const SamplesList = () => {
    const {
        examinationStore: {
            activeSample,
            sampleSorting,
            samplesFiltersQueryString,
            setActiveSample,
            selectedWorkplace,
            examTemplatesByWorkplaceLookup,
        },
    } = useExaminationStore();

    const { isLoading, data } = useQuery(
        SAMPLES_QUERY_KEYS.FILTER_SAMPLES_LIST(samplesFiltersQueryString),
        examinationsListOfSamples(samplesFiltersQueryString),
        {
            select: queryData => queryData.data,
        }
    );

    const { data: sampleTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const examinationsList = useMemo(
        () => prepareExaminationsListOfSamples(sampleSorting, data?.data),
        [sampleSorting, data?.data]
    );

    const onPrintClick = () => {
        if (!isWorkplaceSelected) return;
        openPrintTodoListToPrint(
            data?.data.map(({ id }) => id) ?? [],
            selectedWorkplace?.name ?? "",
            examTemplatesByWorkplaceLookup.map(({ value }) => value)
        );
    };

    if (isLoading)
        return (
            <div className="flex justify-center">
                <CircularProgressLoader />
            </div>
        );

    if (!data) return null;

    const isWorkplaceSelected = Boolean(selectedWorkplace);

    return (
        <>
            <div className="flex items-center justify-between gap-3 text-dark-800 text-md text-center mb-3">
                <SortingControls />
                {Boolean(data.total) && (
                    <Tooltip
                        text={isWorkplaceSelected ? "Print samples" : "You should select Workplace first"}
                        isStatic
                        placement="right"
                        offsetDistance={15}
                    >
                        <IconButton
                            aria-label="Print samples"
                            className="px-1"
                            variant="transparent"
                            size="thin"
                            onClick={onPrintClick}
                            onMiddleMouseClick={onPrintClick}
                            data-testid="close-patient-orders-button"
                        >
                            <PrinterIcon className="w-4 h-4" />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
            {Boolean(data.total) && (
                <div className="overflow-y-auto shadow-card-shadow">
                    <div className="flex flex-col gap-y-2 max-h-full">
                        {examinationsList.map(({ uuid, barcode, expire_date_timestamp, type_id, ...rest }) => (
                            <SampleItem
                                key={uuid}
                                isSelected={uuid === activeSample?.uuid}
                                sampleNumber={barcode}
                                expiredTime={expire_date_timestamp}
                                sampleType={getLookupItem(sampleTypesLookup, type_id)?.label || ""}
                                onClickHandler={() =>
                                    setActiveSample(
                                        activeSample?.uuid !== uuid
                                            ? {
                                                  uuid,
                                                  barcode,
                                                  expire_date_timestamp,
                                                  type_id,
                                                  ...rest,
                                              }
                                            : null
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
            <p className="text-dark-800 text-md font-bold mt-3" data-testid="samples-filter-list-total">
                Results found: {data.total}
            </p>
        </>
    );
};

export default observer(SamplesList);
