import { Lookup } from "../../../../../../shared/models/form";

export interface MakeStaffFormData {
    organization: Lookup<number>;
    position: Lookup<number>;
}

export interface MakeStaffDrawerContainerProps {
    onSubmit: (formData: MakeStaffFormData) => Promise<void>;
}

export interface MakeStaffDrawerProps extends MakeStaffDrawerContainerProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues: Record<string, string | null>;
}

export interface RemoveFromStaffDialogProps {
    onSubmit: () => Promise<void>;
    isLoading: boolean;
}

export interface StaffManagementProps {
    id: string;
}
