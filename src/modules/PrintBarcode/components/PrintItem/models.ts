import { SampleDetails } from "../../../../shared/models/business/sample";
import { Patient } from "../../../../shared/models/business/user";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";

export type PrintItemProps = {
    dataPatient: Patient;
    dataSample: SampleDetails;
    sampleTypes: Lookup<ID>[];
};
