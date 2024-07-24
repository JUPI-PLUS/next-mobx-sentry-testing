// models
import { FilteredUser, Patient } from "../../shared/models/business/user";

export interface UserDetailsProps {
    user: FilteredUser | (Patient & { birth_date_at_timestamp?: number | null });
}
