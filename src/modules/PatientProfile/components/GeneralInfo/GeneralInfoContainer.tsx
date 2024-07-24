// libs
import { AxiosError } from "axios";
import { FC, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import { getUnixTime } from "date-fns";

// helpers
import { queryClient } from "../../../../../pages/_app";
import { editUserProfile } from "../../../../api/employee";
import { removeOffsetFromDate } from "../../../../shared/utils/date";
import { getSexTypes } from "../../../../api/dictionaries";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { schema } from "./schema";

// constants
import { DICTIONARIES_QUERY_KEYS, PATIENTS_QUERY_KEYS, USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// stores
import { usePatientStore } from "../../store";
import { useRootStore } from "../../../../shared/store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { ID } from "../../../../shared/models/common";
import { EditGeneralInfoFormPost, GeneralInfoContainerProps, GeneralInfoFormFields } from "./models";
import { Sex } from "../../../../shared/models/business/user";
import { Lookup } from "../../../../shared/models/form";

// components
import { getCalendarDefaultValue } from "../../../../components/uiKit/DatePickers/utils";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { GeneralInfoContainerSkeleton } from "./components/Skeletons";
import GeneralInfoForm from "./GeneralInfoForm";

const GeneralInfoContainer: FC<GeneralInfoContainerProps> = ({ id = "" }) => {
    const {
        user: { user },
    } = useRootStore();
    const {
        patientStore: { patient, setupSexTypes },
    } = usePatientStore();

    const { data: sexLookupList = [], isFetching: isSexLookupListFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SEX_TYPES,
        getSexTypes,
        {
            select: queryData => toLookupList(queryData.data.data),
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
        }
    );

    useEffect(() => {
        if (sexLookupList.length && !isSexLookupListFetching) {
            setupSexTypes(sexLookupList);
        }
    }, [sexLookupList.length, isSexLookupListFetching]);

    const { mutateAsync, isError, error } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>,
        { editProfileFormFields: EditGeneralInfoFormPost; id: ID }
    >(editUserProfile, {
        async onSuccess() {
            showSuccessToast({
                title: "Profile has been successfully updated",
            });
            await queryClient.refetchQueries(PATIENTS_QUERY_KEYS.PATIENT(id));
        },
    });

    const defaultValues: GeneralInfoFormFields = useMemo(
        () => ({
            first_name: patient?.first_name ?? "",
            last_name: patient?.last_name ?? "",
            sex: getLookupItem(sexLookupList, patient?.sex_id) as Lookup<Sex>,
            birth_date: getCalendarDefaultValue({ from: Number(patient!.birth_date) }) as { from: Date },
            email: patient?.email ?? "",
            status: false,
            citizenship: undefined,
            contingent: undefined,
            electronic_health_card: undefined,
            middle_name: undefined,
            notes: undefined,
            preferred_language: undefined,
        }),
        [patient, sexLookupList]
    );

    const onSubmit = async (profileFormFields: GeneralInfoFormFields) => {
        // TODO: change payload, after BE create correct request
        const { birth_date: birthDate, email, sex, isMakeAStaff, ...rest } = profileFormFields;

        const editProfileFormFields: EditGeneralInfoFormPost = {
            sex_id: sex!.value,
            birth_date: getUnixTime(removeOffsetFromDate(birthDate.from)),
            ...rest,
        };
        await mutateAsync({ editProfileFormFields, id });

        if (id === user?.uuid) await queryClient.refetchQueries(USERS_QUERY_KEYS.ME);
    };

    if (isSexLookupListFetching) return <GeneralInfoContainerSkeleton />;

    return (
        <FormContainer<GeneralInfoFormFields>
            onSubmit={onSubmit}
            schema={schema}
            defaultValues={defaultValues}
            className="max-h-full h-full w-full flex flex-col bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg divide-y divide-dark-500"
        >
            <GeneralInfoForm id={id} isError={isError} errors={error} defaultValues={defaultValues} />
        </FormContainer>
    );
};

export default observer(GeneralInfoContainer);
