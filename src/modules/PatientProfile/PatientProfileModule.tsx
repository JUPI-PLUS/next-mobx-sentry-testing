// libs
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { Suspense, useEffect, useMemo } from "react";
import { useQuery } from "react-query";

// helpers
import { details } from "../../api/users";
import { tabsArr } from "./utils";
import { isAccessAllowed } from "../../shared/utils/auth";
import { getIsUserDeleted } from "../../shared/utils/user";

// constants
import { PATIENTS_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { ROUTES } from "../../shared/constants/routes";

// models
import { Patient } from "../../shared/models/business/user";
import { ServerResponse } from "../../shared/models/axios";

// stores
import { usePatientStore } from "./store";
import { useRootStore } from "../../shared/store";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Breadcrumbs from "../../components/uiKit/Breadcrumbs/Breadcrumbs";
import CircularProgressLoader from "../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import TabPanel from "../../components/uiKit/Tabs/components/TabPanel/TabPanel";
import Tabs from "../../components/uiKit/Tabs/Tabs/Tabs";
import PermissionAccessPage from "../../components/UserAccess/PermissionAccess/PermissionAccessPage";
import TabSwitcher from "./components/TabSwitcher/TabSwitcher";
import ShortInfo from "./components/ShortInfo/ShortInfo";
import InnerPageLayout from "../../components/Layouts/InnerPageLayout/InnerPageLayout";
import FullPageLoading from "../../components/uiKit/FullPageLoading/FullPageLoading";
import { showWarningToast } from "../../components/uiKit/Toast/helpers";

const PatientProfileModule = () => {
    const { replace } = useRouter();

    const {
        patientStore: { patient, setPatient, cleanup },
    } = usePatientStore();

    const {
        user: { permissions: userPermissions },
    } = useRootStore();

    const {
        query: { patientUUID },
    } = useRouter();

    const patientUUIDFromQuery = patientUUID as string;

    const tabsWithPermissions = useMemo(
        () =>
            tabsArr.map(tab => ({
                ...tab,
                isDisabled: !isAccessAllowed(userPermissions, tab.permissions ?? [], tab.tolerant ?? false),
            })),
        [userPermissions]
    );

    const { isFetching } = useQuery<ServerResponse<Patient>, AxiosError, Patient>(
        PATIENTS_QUERY_KEYS.PATIENT(patientUUIDFromQuery),
        details(patientUUIDFromQuery),
        {
            select: queryData => queryData.data.data,
            onSuccess: selectedPatient => {
                const isUserDeleted = getIsUserDeleted(selectedPatient);
                if (!isUserDeleted) {
                    setPatient(selectedPatient);
                    return;
                }
                showWarningToast({ title: "This patient was deleted. You can not see information about this patient" });
                replace(ROUTES.orders.list.route);
            },
            onError: () => replace(ROUTES.errors.notFound.route),
        }
    );

    useEffect(() => cleanup, []);

    const isPatientDataLoading = !patient || isFetching;

    if (isPatientDataLoading) return <FullPageLoading />;

    return (
        <InnerPageLayout className="p-6 pt-3 gap-4">
            <Breadcrumbs label="Profile details" />
            <div className="grid grid-cols-4 h-full w-full gap-4">
                <ShortInfo id={patientUUIDFromQuery} />
                <Tabs
                    tabs={tabsWithPermissions}
                    containerClassname="max-h-full flex flex-col col-span-3 overflow-hidden shadow-card-shadow rounded-lg"
                >
                    {tabsArr.map((tab, index) => (
                        <TabPanel key={tab.label} className="max-h-full h-full w-full overflow-hidden">
                            <PermissionAccessPage required={tab?.permissions ?? []} tolerant={tab?.tolerant ?? false}>
                                <ErrorBoundary>
                                    <Suspense fallback={<CircularProgressLoader />}>
                                        <TabSwitcher
                                            index={index}
                                            tab={tab}
                                            patientUUIDFromQuery={patientUUIDFromQuery}
                                        />
                                    </Suspense>
                                </ErrorBoundary>
                            </PermissionAccessPage>
                        </TabPanel>
                    ))}
                </Tabs>
            </div>
        </InnerPageLayout>
    );
};

export default observer(PatientProfileModule);
