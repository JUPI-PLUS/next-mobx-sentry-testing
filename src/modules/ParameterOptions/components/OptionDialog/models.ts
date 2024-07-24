import { OptionFormData } from "../../models";
import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../../shared/models/axios";

export interface OptionDialogProps {
    submitText: string;
    title: string;
    onSubmit: (formData: OptionFormData) => Promise<void>;
    isOpen: boolean;
    onClose: () => void;
    defaultValues: Record<string, string>;
    error: AxiosError<BaseFormServerValidation> | null;
}
