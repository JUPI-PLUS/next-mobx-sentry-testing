// models
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { PhoneContact } from "../../../../shared/models/phones";

export interface PhoneContactDrawerProps {
    isOpen: boolean;
    contact: PhoneContact | null;
    onRefetchData: () => void;
    onClose: () => void;
    userUUID: string;
}

export interface PhoneContactFormProps {
    phoneTypesLookup: Lookup<ID>[];
    isVerified: boolean;
}

export interface PhoneContactFormFields {
    type_id: Lookup<ID> | null;
    number: string;
}
