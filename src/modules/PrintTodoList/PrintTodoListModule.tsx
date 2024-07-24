import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { SAMPLES_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { examinationsListOfSamples } from "../../api/samples";
import { useRouter } from "next/router";
import { stringify } from "query-string";
import { CircularProgressLoader } from "../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { COMMA_SEPARATOR } from "../../shared/constants/common";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../shared/constants/formates";
import { transformSamplesList } from "./utils";
import SampleTodoListItem from "./components/SampleTodoListItem";
import { ROUTES } from "../../shared/constants/routes";

const PrintTodoListModule = () => {
    const areBarcodesMounted = useRef<boolean[]>([]);
    const [areAllBarcodesMounted, setAreAllBarcodesMounted] = useState(false);
    const {
        replace,
        query: { ids, workplaceName, exams },
        isReady,
    } = useRouter();

    const pickedExams = useMemo(
        () => (exams as string)?.split(COMMA_SEPARATOR).map(value => parseInt(value, 10)),
        [exams]
    );

    const sampleFilters = useMemo(() => {
        return stringify({ id: (ids as string)?.split(COMMA_SEPARATOR) }, { arrayFormat: "bracket" });
    }, [ids]);

    const isQueryEnabled = isReady && Boolean(ids?.length) && Boolean(workplaceName) && Boolean(exams?.length);

    const { isLoading, data } = useQuery(
        SAMPLES_QUERY_KEYS.FILTER_SAMPLES_LIST(sampleFilters),
        examinationsListOfSamples(sampleFilters),
        {
            enabled: isQueryEnabled,
            select: queryData => transformSamplesList(queryData.data.data, pickedExams),
            onSuccess: queryData => {
                areBarcodesMounted.current = new Array(queryData.length).fill(false);
            },
            onError: () => {
                replace(ROUTES.examinations.route);
            },
        }
    );

    useEffect(() => {
        if (isReady && (!Boolean(ids?.length) || !Boolean(workplaceName) || !Boolean(exams?.length))) {
            replace(ROUTES.examinations.route);
        }
    }, [exams?.length, ids?.length, isReady, workplaceName]);

    const onBarcodeMounted = (index: number) => {
        const start = areBarcodesMounted.current.slice(0, index);
        const end = areBarcodesMounted.current.slice(index + 1);
        const result = [...start, true, ...end];
        areBarcodesMounted.current = [...start, true, ...end];
        if (result.every(isBarcodeMounted => isBarcodeMounted)) {
            setAreAllBarcodesMounted(true);
        }
    };

    useEffect(() => {
        if (areAllBarcodesMounted) {
            window.print();
            window.close();
        }
    }, [areAllBarcodesMounted]);

    return (
        <>
            <style jsx>{`
                @print {
                    @page:footer {
                        display: none;
                    }

                    @page:header {
                        display: none;
                    }
                }
                @page {
                    size: landscape;
                    margin: 0;
                }
            `}</style>
            {!areAllBarcodesMounted && (
                <CircularProgressLoader containerClassName="fixed top-0 left-0 bg-white opacity-60 w-full h-screen flex items-center justify-center" />
            )}
            <div className="px-4 pt-14 pb-8">
                <div className="flex items-center justify-between px-10 pb-8">
                    <div>
                        <img src="images/PrintableLogo.png" alt="" />
                    </div>
                    <div className="text-right">
                        <p>
                            Workplace name: <span className="font-bold">{workplaceName}</span>
                        </p>
                        <p>
                            Created at:
                            <span className="font-bold ml-1">
                                {format(new Date(), DATE_FORMATS.DATE_TIME_ONLY_DOTS)}
                            </span>
                        </p>
                    </div>
                </div>
                {isLoading ? (
                    <CircularProgressLoader containerClassName="w-full h-screen flex items-center justify-center" />
                ) : (
                    <div>
                        <table className="w-full table-fixed border-dark-500 border">
                            <thead>
                                <tr>
                                    <th className="border-dark-500 border py-3">Order №</th>
                                    <th className="border-dark-500 border py-3">Sample №</th>
                                    <th className="border-dark-500 border py-3">Patient</th>
                                    <th className="border-dark-500 border py-3">Sampling datetime</th>
                                    <th className="border-dark-500 border py-3">Referral Doctor</th>
                                    <th className="border-dark-500 border py-3">Examinations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map(({ sampleNumber, orderNumber, ...restProps }, index) => (
                                    <SampleTodoListItem
                                        key={`${sampleNumber}-${orderNumber}`}
                                        {...restProps}
                                        sampleNumber={sampleNumber}
                                        orderNumber={orderNumber}
                                        onBarcodeMounted={() => onBarcodeMounted(index)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default PrintTodoListModule;
