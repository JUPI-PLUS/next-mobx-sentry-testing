import { observer } from "mobx-react";
import FormSelect from "../../../../../../../../components/uiKit/forms/selects/Select/FormSelect";
import { toLookupList } from "../../../../../../../../shared/utils/lookups";
import { useCreateOrderStore } from "../../../../../../store";
import { OnChangeValue } from "react-select";
import { Lookup } from "../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../shared/models/common";
import CircularProgressLoader from "../../../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const Conditions = () => {
    const {
        createOrderStore: { filteredConditions, isConditionsFetching, setupConditionsValues },
    } = useCreateOrderStore();

    const onConditionChange = (value: OnChangeValue<Lookup<ID>, false>, name: string) => {
        setupConditionsValues({ [name]: value || null });
    };

    if (isConditionsFetching) {
        return (
            <div className="flex justify-center" data-testid="circular-progress-wrapper">
                <CircularProgressLoader />
            </div>
        );
    }

    return (
        <>
            {!isConditionsFetching && filteredConditions.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <p className="font-bold">Conditions</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {filteredConditions.map(condition => (
                            <FormSelect
                                key={condition.name}
                                label={condition.name}
                                name={condition.name}
                                options={toLookupList(condition.options) || []}
                                onChange={value => onConditionChange(value, condition.name)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default observer(Conditions);
