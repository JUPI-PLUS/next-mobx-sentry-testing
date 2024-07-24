import { Order } from "../../shared/models/business/order";
import { ID } from "../../shared/models/common";
import { ExamStatusesEnum } from "../../shared/models/business/exam";
import { SampleStatuses, UrgencyStatus } from "../../shared/models/business/enums";

export interface OrderDetails extends Omit<Order, "first_name" | "last_name" | "referral_doctor" | "number_of_exams"> {
    referral_doctor: string | null;
    created_at: string;
    created_at_timestamp: number;
    updated_at: string;
    updated_at_timestamp: number;
    referral_notes: string | null;
}

export interface OrderExamDetails {
    exam_id: ID;
    exam_uuid: string;
    exam_name: string;
    volume: number;
    si_measurement_unit_id: number;
    exam_status: ExamStatusesEnum;
    sample_statuses_id: SampleStatuses | null;
    sample_id: number | null;
    sample_num: string | null;
    sample_type: number;
    sample_uuid: string;
    urgency_id: UrgencyStatus;
}

export interface OrderExamDetailsWithStatus extends OrderExamDetails {
    type: "group" | "exam";
    exam_status_text: string;
    sampleName: string;
}

// DEP
export interface SampleCheckboxProps {
    exams: Array<OrderExamDetailsWithStatus>;
    // DEP
    order: Order;
}
