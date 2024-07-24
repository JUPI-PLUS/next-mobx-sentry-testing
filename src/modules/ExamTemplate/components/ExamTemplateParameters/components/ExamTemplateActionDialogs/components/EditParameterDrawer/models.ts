// models
import { Parameter } from "../../../../../../../../shared/models/business/parameter";

export interface EditParameterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onEditParameter: (parameterData: Parameter) => void;
    paramUUID?: string;
}
