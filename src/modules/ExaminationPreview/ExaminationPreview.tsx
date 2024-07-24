// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

// api
import { getExaminationListBySample, getSampleDetails } from "../../api/samples";

// helpers
import { getConcatenatedExams, getGroupedExamsByStatus } from "./helpers";

// constants
import { SAMPLES_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { ROUTES } from "../../shared/constants/routes";

// components
import Header from "./components/Header/Header";
import ProgressExaminations from "./components/ProgressExaminations/ProgressExaminations";
import DoneExaminations from "./components/DoneExaminations/DoneExaminations";
import FullPageLoading from "../../components/uiKit/FullPageLoading/FullPageLoading";

const ExaminationPreview = () => {
    const {
        query: { uuid },
        replace,
    } = useRouter();

    const sampleUUID = uuid as string;

    const { data: sampleDetails, isLoading: isSampleDetailsLoading } = useQuery(
        SAMPLES_QUERY_KEYS.DETAILS(sampleUUID),
        getSampleDetails(sampleUUID),
        {
            enabled: Boolean(sampleUUID),
            select: queryData => queryData.data.data,
            onError: () => replace(ROUTES.errors.notFound.route),
        }
    );

    const { data: examinationListBySample, isLoading: isExaminationDataLoading } = useQuery(
        SAMPLES_QUERY_KEYS.EXAMINATIONS_BY_SAMPLE(sampleUUID),
        getExaminationListBySample(sampleUUID),
        {
            enabled: Boolean(sampleUUID),
            select: queryData => queryData.data.data,
            onError: () => replace(ROUTES.errors.notFound.route),
        }
    );

    const { progressExams, doneExams } = useMemo(() => {
        const concatenatedExams = getConcatenatedExams(examinationListBySample ?? []);
        return getGroupedExamsByStatus(concatenatedExams);
    }, [examinationListBySample]);

    if (isSampleDetailsLoading || !sampleDetails || isExaminationDataLoading || !examinationListBySample)
        return <FullPageLoading />;

    return (
        <div>
            <Header sampleUUID={sampleUUID} />
            <ProgressExaminations exams={progressExams!} />
            <DoneExaminations exams={doneExams!} sampleDetails={sampleDetails!} />
        </div>
    );
};

export default ExaminationPreview;
