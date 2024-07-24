import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { SingleValue } from "react-select";
import { getDamageTypesLookup } from "../../../../api/lookups";
import FormDatetimePicker from "../../../../components/uiKit/DatePickers/DatetimePicker/FormDatetimePicker";
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { ID } from "../../../../shared/models/common";
import { Lookup } from "../../../../shared/models/form";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import DamageNote from "./components/DamageNote/DamageNote";

const SampleChangeStatusForm = () => {
    const [damageNote, setDamageNote] = useState<null | string>(null);

    const { data: damageTypes = [] } = useQuery(DICTIONARIES_QUERY_KEYS.DAMAGE_TYPES, getDamageTypesLookup, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => queryData.data.data,
    });

    const damageTypesLookup = useMemo(() => {
        const commonDictionaryDamageTypes = damageTypes.map(({ id, description, ...rest }) => ({
            ...rest,
            id,
            name: description,
        }));
        return toLookupList(commonDictionaryDamageTypes, true);
    }, [damageTypes]);

    const selectReasonHandler = (selectedValue: SingleValue<Lookup<ID>>) => {
        const damageTypeNote = getLookupItem(damageTypesLookup, selectedValue?.value)?.notes;

        if (damageTypeNote && damageTypeNote !== damageNote) {
            setDamageNote(damageTypeNote);
        }
    };

    return (
        <>
            <FormDatetimePicker
                name="updated_at"
                label="Datetime"
                popperPlacement="bottom-start"
                offsetDistance={10}
                offsetSkidding={15}
                disabledDate={{ after: new Date() }}
                popperClassName="z-50 border border-inset border-dark-300 shadow-card-shadow rounded-lg"
            />
            <FormSelect
                onChange={selectReasonHandler}
                label="Reason"
                name="damage_reason"
                options={damageTypesLookup}
            />
            <DamageNote note={damageNote} />
        </>
    );
};

export default SampleChangeStatusForm;
