import { FilteredUser, Patient, User } from "../models/business/user";

export const getIsUserDeleted = (user?: User | Patient | FilteredUser | null) =>
    Boolean(user && !user.first_name && !user.sex_id);
