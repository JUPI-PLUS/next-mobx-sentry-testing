import { CreatableLookup, Lookup } from "../../../shared/models/form";
import { Option } from "../components/SubmitParamterStep/models";
import { Parameter } from "../../../shared/models/business/parameter";
import { ID } from "../../../shared/models/common";
import { ParameterViewTypeEnum } from "../../../shared/models/business/enums";

export enum AddParameterStepsEnum {
    FIND_PARAMETER,
    SUBMIT_PARAMETER_GENERAL_DATA,
    SUBMIT_CONDITIONS,
}

export interface ExistingParameterLookup extends CreatableLookup<string> {
    uuid?: string;
    id?: number;
}

export interface FindParameterFormData {
    parameterCodeAutocomplete: ExistingParameterLookup;
}

export interface SubmitParameterFormData {
    code: string;
    si_measurement_units_id: Lookup<ID> | null;
    type_view_id: Lookup<ParameterViewTypeEnum> | null;
    name: string;
    biological_reference_intervals: string;
    notes: string | null;
    options: Option[] | null;
    is_printable: boolean;
    is_required: boolean;
}

export interface CreateParameterBody extends Omit<Parameter, "uuid" | "options" | "id"> {
    options: ID[] | null;
}

export interface AssignOrCreateParameterDrawerProps {
    onClose: () => void;
    onSubmit: (formData: Parameter) => void;
    pickedParamsUUID?: string[];
}

export enum SubmitActionTypeEnum {
    CREATE,
    EDIT,
}
