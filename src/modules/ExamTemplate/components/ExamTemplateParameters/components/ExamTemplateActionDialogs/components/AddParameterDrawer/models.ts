// models
import { Parameter } from "../../../../../../../../shared/models/business/parameter";

export interface AddParameterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddParameter: (parameterData: Parameter) => void;
    pickedParamsUUID: string[];
}
