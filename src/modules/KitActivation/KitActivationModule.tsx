// libs
import React, { useEffect } from "react";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// helpers
import { getExamsTemplatesByKitCode, getOrderConditionsByKitCode } from "../../api/kits";

// stores
import { useKitActivationStore } from "./store";

// constants
import { KITS_QUERY_KEYS } from "../../shared/constants/queryKeys";

// models
import { BaseFormServerValidation, ServerResponse } from "../../shared/models/axios";
import { OrderConditionResponse } from "./models";

// components
import InnerPageLayout from "../../components/Layouts/InnerPageLayout/InnerPageLayout";
import Breadcrumbs from "../../components/uiKit/Breadcrumbs/Breadcrumbs";
import UserDetails from "./components/UserDetails/UserDetails";
import KitActivationContainer from "./components/KitActivationContainer/KitActivationContainer";
import ExamTemplatesList from "./components/ExamTemplatesList/ExamTemplatesList";

const KitActivationModule = () => {
    const {
        kitActivationStore: { kitCode, setupConditions, cleanup },
    } = useKitActivationStore();

    const {
        isFetching: isConditionsListFetching,
        error,
        isError,
    } = useQuery<
        ServerResponse<Array<OrderConditionResponse>>,
        AxiosError<BaseFormServerValidation>,
        Array<OrderConditionResponse>
    >(KITS_QUERY_KEYS.KIT_ORDER_CONDITIONS_BY_KIT_CODE(kitCode), getOrderConditionsByKitCode(kitCode), {
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            setupConditions(queryData);
        },
        onError: () => {
            setupConditions([]);
        },
        enabled: Boolean(kitCode),
        retry: false,
    });

    const { data: examsTemplates = [], isFetching: isExamsTemplatesFetching } = useQuery(
        KITS_QUERY_KEYS.KIT_EXAMS_TEMPLATES_BY_KIT_CODE(kitCode),
        getExamsTemplatesByKitCode(kitCode),
        {
            select: queryData => queryData.data.data,
            enabled: Boolean(kitCode && !isConditionsListFetching && !isError),
            retry: false,
        }
    );

    useEffect(() => () => cleanup(), []);

    return (
        <InnerPageLayout className="p-6 pt-3 gap-4">
            <Breadcrumbs label="Kit activation" />
            <div className="grid grid-cols-6 gap-2">
                <div className="col-span-4 bg-white flex flex-col w-full rounded-lg shadow-card-shadow border-gray-200 h-full max-h-full overflow-y-hidden">
                    <UserDetails />
                    <KitActivationContainer
                        isConditionsListFetching={isConditionsListFetching}
                        errors={error}
                        isError={isError}
                    />
                </div>
                <div className="col-span-2 bg-white w-full rounded-lg shadow-card-shadow border-gray-200 h-full max-h-full overflow-x-auto overflow-y-hidden p-6 gap-4 flex flex-col">
                    <ExamTemplatesList
                        examsTemplates={examsTemplates}
                        isExamsTemplatesFetching={isExamsTemplatesFetching || isConditionsListFetching}
                    />
                </div>
            </div>
        </InnerPageLayout>
    );
};

export default observer(KitActivationModule);
