import { ExaminationSample } from "../../shared/models/business/exam";
import { SampleTodoListRow } from "./models";

export const transformSamplesList = (samples: ExaminationSample[], pickedExams: number[]) => {
    return samples.reduce(
        (
            acc,
            { barcode, exams: sampleExams, sampling_datetime_timestamp, birth_date_at_timestamp, first_name, last_name }
        ) => {
            const setOfOrderNumbers = new Set<string>();
            const examNames: string[] = [];
            let examReferralDoctor: string | null = null;
            const filteredExams = sampleExams.filter(({ template_id }) => pickedExams.includes(template_id));

            for (const exam of filteredExams) {
                setOfOrderNumbers.add(exam.order_number);
                examNames.push(exam.name);
                examReferralDoctor = exam.referral_doctor;
            }

            return [
                ...acc,
                ...Array.from(setOfOrderNumbers).map(order_number => ({
                    orderNumber: order_number,
                    sampleNumber: barcode,
                    referralDoctor: examReferralDoctor,
                    samplingDatetime: sampling_datetime_timestamp,
                    firstName: first_name,
                    lastName: last_name,
                    birthdateTimestamp: birth_date_at_timestamp,
                    examNames,
                })),
            ];
        },
        [] as SampleTodoListRow[]
    );
};
