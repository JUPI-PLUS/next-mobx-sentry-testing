import { observer } from "mobx-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import { queryClient } from "../../../../../../../../pages/_app";
import { getMeasureUnitDetails } from "../../../../../../../api/measureUnits";
import FormInput from "../../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import { showErrorToast } from "../../../../../../../components/uiKit/Toast/helpers";
import { MEASURE_UNITS_QUERY_KEYS } from "../../../../../../../shared/constants/queryKeys";
import { useFormValidation } from "../../../../../../../shared/hooks/useFormValidation";
import { useMeasureUnitsStore } from "../../../../../store";
import { FormEditMeasureUnitInputsProps } from "../../../models";
import FormEditMeasureUnitInputsSkeleton from "./FormEditMeasureUnitInputsSkeleton";

const FormEditMeasureUnitInputs: FC<FormEditMeasureUnitInputsProps> = ({ isError, errors }) => {
    const {
        measureUnitsStore: { measureUnit, lastRequestedQueryKey, cleanupSelectedMeasureUnit },
    } = useMeasureUnitsStore();

    const { reset } = useFormContext();

    useFormValidation({ isError, errors });

    const { isFetching: isMeasureUnitFetching } = useQuery(
        MEASURE_UNITS_QUERY_KEYS.DETAILS(measureUnit!.id!),
        getMeasureUnitDetails(measureUnit!.id!),
        {
            onSuccess: queryData => {
                reset({ name: queryData.data.data.name });
            },
            onError: async () => {
                showErrorToast({ title: "Measure unit not found" });
                await queryClient.refetchQueries(lastRequestedQueryKey);
                cleanupSelectedMeasureUnit();
            },
            refetchOnWindowFocus: true,
        }
    );

    if (isMeasureUnitFetching) return <FormEditMeasureUnitInputsSkeleton />;

    return (
        <div className="mb-8">
            <FormInput name="name" label="Name" data-testid="edit-name-input" autoFocus />
        </div>
    );
};

export default observer(FormEditMeasureUnitInputs);
