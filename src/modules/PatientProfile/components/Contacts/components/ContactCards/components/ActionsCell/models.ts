// models
import { PhoneContact } from "../../../../../../../../shared/models/phones";
import { EmailContact } from "../../../../../../../../shared/models/emails";

export type ActionsCellProps = {
    contact: PhoneContact | EmailContact;
    type: string;
};
