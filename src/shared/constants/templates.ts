export const MAX_GROUP_NEST_LVL = 5;

// TODO: remove messages after add localize status
export const TEMPLATES_MESSAGES = {
    GROUP_CREATED: (name: string) => `Group ${name} has been created`, // Creating of folder successfully
    GROUP_UPDATED: (name: string) => `Group ${name} has been updated`, // Updating of folder successfully
    GROUP_DELETED: (name: string) => `Group ${name} has been deleted`, // Delete group
    GROUP_ALREADY_DELETED: (name: string) => `Group ${name} has been already deleted`, // Delete/Update or move into already deleted folder
    GROUP_ALREADY_HAS_CHILDREN: (name: string) => `Group ${name} already has children`, // Delete folder with children
    GROUP_WAS_MOVED: (name: string) => `Group ${name} has been moved`, // Move folder into another folder successfully
    GROUP_WAS_MOVED_INTO_GROUP: (name: string, groupName: string) =>
        `Group ${name} has been moved into group ${groupName}`, // Move folder into another folder successfully
    GROUP_CANNOT_MOVE: (name: string) => `Can't move ${name} group`, // Move folder into another folder failed
    GROUP_CANNOT_CREATE: "Can't create group", // Create folder into another folder failed
    MAYBE_GROUP_WAS_DELETED: "Maybe group was deleted", // Additional message
    MAYBE_TARGET_GROUP_WAS_DELETED: "Maybe target group was deleted", // Additional message
    GROUP_NESTED_LVL_MORE_THEN_MAX: `Maximum nested level must be less than ${MAX_GROUP_NEST_LVL}`, // Create/add smth into already deleted folder

    EXAM_CREATED: (name: string) => `Exam template ${name} has been created`, // Creating of exam template successfully
    EXAM_UPDATED: (name: string) => `Exam template ${name} has been updated`, // Updating of exam template successfully
    EXAM_PARAMETERS_UPDATED: (name: string) => `Parameters of ${name} exam template have been updated`, // Updating of exam template parameters successfully
    EXAM_DELETED: (name: string) => `Exam template ${name} has been deleted`, // Delete exam template
    EXAM_ALREADY_DELETED: (name: string) => `Exam template ${name} has been already deleted`, // Delete/Update or move already deleted exam template
    EXAM_WAS_MOVED: (name: string) => `Exam template ${name} has been moved`, // Move exam template into folder successfully
    EXAM_WAS_MOVED_INTO_GROUP: (name: string, groupName: string) =>
        `Exam template ${name} has been moved into group ${groupName}`, // Move exam template into folder successfully
    EXAM_CANNOT_MOVE: (name: string) => `Can't move ${name} exam template`, // Move exam template into folder failed

    KIT_CREATED: (name: string) => `Kit template ${name} has been created`, // Creating of kit template successfully
    KIT_UPDATED: (name: string) => `Kit template ${name} has been updated`, // Updating of kit template successfully
    KIT_DELETED: (name: string) => `Kit template ${name} has been deleted`, // Delete kit template
    KIT_ALREADY_DELETED: (name: string) => `Kit template ${name} has been already deleted`, // Delete/Update or move already deleted kit template
    KIT_WAS_MOVED: (name: string) => `Kit template ${name} has been moved`, // Move kit template into folder successfully
    KIT_WAS_MOVED_INTO_GROUP: (name: string, groupName: string) =>
        `Kit template ${name} has been moved into group ${groupName}`, // Move kit template into folder successfully
    KIT_CANNOT_MOVE: (name: string) => `Can't move ${name} kit template`, // Move kit template into folder failed
};
