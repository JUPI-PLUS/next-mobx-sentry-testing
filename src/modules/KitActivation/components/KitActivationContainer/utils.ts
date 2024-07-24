import { Patient, Sex } from "../../../../shared/models/business/user";
import { getPatientAge } from "../../../../shared/utils/date";
import { HiddenConditions, OrderConditionResponse } from "../../models";
import { KitActivationFormData } from "./models";

export const prepareConditionData = (
    conditions: Array<OrderConditionResponse>,
    conditionsFormData: KitActivationFormData,
    orderPatient: Patient
) => {
    return conditions.map(condition => {
        switch (condition.id) {
            case HiddenConditions.SEX:
                return {
                    type_id: condition.id,
                    operator: condition.operator,
                    value: orderPatient?.sex_id ?? Sex.UNKNOWN,
                };
            case HiddenConditions.AGE_YEARS:
            case HiddenConditions.AGE_DAYS:
                return {
                    type_id: condition.id,
                    operator: condition.operator,
                    value: getPatientAge(
                        orderPatient?.birth_date ?? 0,
                        condition.id === HiddenConditions.AGE_DAYS ? "days" : "years"
                    ),
                };
        }

        return {
            type_id: condition.id,
            operator: condition.operator,
            value: conditionsFormData[condition.name].value,
        };
    });
};
