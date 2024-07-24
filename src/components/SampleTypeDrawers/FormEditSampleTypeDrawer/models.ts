import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../shared/models/axios";
import { ExamTemplate } from "../../../shared/models/business/exam";
import { SampleType } from "../../../shared/models/business/sampleTypes";

export interface SubmitEditSampleTypeData {
    code: string;
    name: string;
}

export interface FormSubmitEditSampleTypeDataProps {
    error: AxiosError<BaseFormServerValidation> | null;
    isLoading: boolean;
}

export interface FormEditSampleTypeDrawerProps {
    error: AxiosError<BaseFormServerValidation> | null;
    isLoading: boolean;
    sampleType: SampleType;
}

export interface ExamTemplatesListProps {
    list: Array<ExamTemplate>;
    isLoading: boolean;
}

export interface FormEditSampleTypeDrawerContainerProps {
    sampleType: SampleType;
}
