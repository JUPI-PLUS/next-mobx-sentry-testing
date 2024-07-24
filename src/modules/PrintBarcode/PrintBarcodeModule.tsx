import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getSampleDetails } from "../../api/samples";
import { details } from "../../api/users";
import { DICTIONARIES_QUERY_KEYS, PATIENTS_QUERY_KEYS, SAMPLES_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { ServerResponse } from "../../shared/models/axios";
import { SampleDetails } from "../../shared/models/business/sample";
import { Patient } from "../../shared/models/business/user";
import { getSampleTypes } from "../../api/dictionaries";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../shared/constants/queries";
import { toLookupList } from "../../shared/utils/lookups";
import PrintItem from "./components/PrintItem/PrintItem";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import FullPageLoading from "../../components/uiKit/FullPageLoading/FullPageLoading";
import printingStyles from "../../../src/styles/Paper.module.css";

const PrintBarcodeModule = () => {
    const { query } = useRouter();

    const { data: dataSampleTypes, isFetching: isDataSampleTypesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        getSampleTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const activeSampleUUID = query.sample_uuid as string;
    const activeSampleUserUUID = query.user_uuid as string;

    const { data: dataSample, isFetching: isDataSampleFetching } = useQuery<
        ServerResponse<SampleDetails>,
        AxiosError,
        SampleDetails
    >(SAMPLES_QUERY_KEYS.DETAILS(activeSampleUUID), getSampleDetails(activeSampleUUID), {
        enabled: Boolean(activeSampleUUID),
        select: queryData => queryData.data.data,
    });

    const { data: dataPatient, isFetching: isDataPatientFetching } = useQuery<
        ServerResponse<Patient>,
        AxiosError,
        Patient
    >(PATIENTS_QUERY_KEYS.PATIENT(activeSampleUserUUID), details(activeSampleUserUUID), {
        enabled: Boolean(activeSampleUserUUID),
        select: queryData => queryData.data.data,
    });

    const isLoading = isDataSampleFetching || isDataPatientFetching || isDataSampleTypesFetching;

    if (isLoading) return <FullPageLoading />;

    if (!dataSampleTypes || !dataSample || !dataPatient) return null;

    return (
        <ErrorBoundary>
            <div className={`${printingStyles.A9} p-2`}>
                <PrintItem dataPatient={dataPatient} dataSample={dataSample} sampleTypes={dataSampleTypes} />
            </div>
        </ErrorBoundary>
    );
};

export default PrintBarcodeModule;
