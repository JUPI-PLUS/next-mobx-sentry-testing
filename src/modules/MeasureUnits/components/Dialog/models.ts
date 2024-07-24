import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../../shared/models/axios";
import { ShortParameter } from "../../../../shared/models/business/parameter";
import { ExamTemplate } from "../../../../shared/models/business/exam";

export interface SubmitCreateMeasureUnitData {
    name: string;
}

export interface SubmitEditMeasureUnitData {
    name: string;
}

export interface FormCreateMeasureUnitInputsProps {
    isError: boolean;
    errors: AxiosError<BaseFormServerValidation> | null;
}

export interface DeleteDialogContentProps {
    isDeleteAvailable: boolean;
    examTemplatesList: Array<ExamTemplate>;
    paramsList: Array<ShortParameter>;
    isLoading: boolean;
    measureUnitName: string;
}

export type FormEditMeasureUnitInputsProps = FormCreateMeasureUnitInputsProps;
