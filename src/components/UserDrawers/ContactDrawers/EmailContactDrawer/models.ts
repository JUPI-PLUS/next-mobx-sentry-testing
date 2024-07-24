// models
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { EmailContact } from "../../../../shared/models/emails";

export interface EmailContactDrawerProps {
    isOpen: boolean;
    contact: EmailContact | null;
    onRefetchData: () => void;
    onClose: () => void;
    userUUID: string;
}

export interface EmailContactFormProps {
    emailTypesLookup: Lookup<ID>[];
    isVerified: boolean;
}

export interface EmailContactFormFields {
    type_id: Lookup<ID> | null;
    email: string;
}
