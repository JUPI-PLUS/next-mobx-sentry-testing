//  libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "react-query";

//  stores
import { useDrawerStepperStore } from "../../../DrawerStepper/store";

// helpers
import { getSampleTypes } from "../../../../api/dictionaries";
import { toLookupList } from "../../../../shared/utils/lookups";

// constants
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

//  components
import FormInput from "../../../uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../uiKit/forms/selects/Select/FormSelect";

const SamplingFirstStep = () => {
    const {
        drawerStepperStore: { setupSubmitButtonText },
    } = useDrawerStepperStore();
    const { control } = useFormContext();
    const sampleNumber = useWatch({
        control,
        name: "sample_number",
    });

    const { data: sampleTypesLookup, isLoading } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select(queryData) {
            return toLookupList(queryData.data.data);
        },
    });

    useEffect(() => {
        setupSubmitButtonText(sampleNumber.length ? "Find or create barcode" : "Generate new barcode");
    }, [sampleNumber]);

    return (
        <>
            <FormSelect
                className="mb-4"
                label="Type"
                name="sample_type"
                options={sampleTypesLookup || []}
                disabled={isLoading}
            />
            <FormInput name="sample_number" label="Sample number" />
        </>
    );
};

export default observer(SamplingFirstStep);
