//  models
import { SampleDetails } from "../../../shared/models/business/sample";
import { Lookup } from "../../../shared/models/form";
import { ID } from "../../../shared/models/common";

export type SampleDetailsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    sampleUUID?: string;
};

export type SampleDetailsDrawerContentProps = { data: SampleDetails; examSampleTypes: Lookup<ID>[] };
