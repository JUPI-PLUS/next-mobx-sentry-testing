// Backend default error messages
// TODO: remove messages after add localize status
import { MAX_GROUP_NEST_LVL } from "../constants/templates";

export const GROUP_ALREADY_DELETED = "This group has been already deleted"; // Delete/Update or move into already deleted folder
export const GROUP_ALREADY_HAS_CHILDREN = "This group already has children"; // Delete folder with children
export const GROUP_NESTED_LVL_MORE_THEN_MAX = `Maximum nested level must be less than ${MAX_GROUP_NEST_LVL}`; // Create/add smth into already deleted folder
