// libs
import React from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

// stores
import { useCreateOrderStore } from "./store";

// api
import { details } from "../../api/users";

// helpers
import { getIsUserDeleted } from "../../shared/utils/user";

// constants
import { PATIENTS_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { ROUTES } from "../../shared/constants/routes";

// components
import SelectedExaminations from "./components/SelectedExaminations/SelectedExaminations";
import Examinations from "./components/Examinations/Examinations";
import UserDetails from "./components/UserDetails/UserDetails";
import CreateOrderSkeleton from "./components/Skeletons";
import { showWarningToast } from "../../components/uiKit/Toast/helpers";

const CreateOrderModule = () => {
    const { replace } = useRouter();

    const {
        createOrderStore: { setupOrderPatient, orderPatient, userUUID },
    } = useCreateOrderStore();

    const { isFetching: isPatientFetching } = useQuery(PATIENTS_QUERY_KEYS.PATIENT(userUUID), details(userUUID), {
        enabled: Boolean(userUUID),
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            const isUserDeleted = getIsUserDeleted(queryData);
            if (!isUserDeleted) {
                setupOrderPatient(queryData);
                return;
            }
            showWarningToast({ title: "This patient was deleted. You can not create order for this patient" });
            replace(ROUTES.orders.list.route);
        },
        onError: () => replace(ROUTES.errors.notFound.route),
    });

    if (isPatientFetching || !orderPatient) return <CreateOrderSkeleton />;

    return (
        <>
            <div className="grid grid-rows-createOrderContentLayout col-start-0 col-span-4 bg-white w-full rounded-lg shadow-card-shadow border-gray-200 h-full max-h-full overflow-x-auto overflow-y-hidden relative">
                <UserDetails />
                <Examinations />
            </div>
            <div className="col-start-5 col-span-2 h-full w-full overflow-hidden shadow-card-shadow">
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex flex-col flex-grow bg-white shadow-card-shadow border-gray-200 rounded-lg overflow-hidden px-6 pt-6 pb-2">
                        <SelectedExaminations />
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(CreateOrderModule);
