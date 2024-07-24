import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { ID } from "../../shared/models/common";
import { Lookup } from "../../shared/models/form";
import { Patient, StaffInfo } from "../../shared/models/business/user";
import { getIsUserDeleted } from "../../shared/utils/user";

export class PatientStore {
    @observable public patient: Patient | null = null;
    @observable public sexTypes: Lookup<ID>[] = [];
    @observable public organizations: Lookup<ID>[] = [];

    constructor() {
        makeObservable(this);
    }

    @action.bound
    cleanup() {
        this.patient = null;
    }

    @action.bound
    setPatient(patient: Patient) {
        this.patient = patient;
    }

    @action.bound
    setupSexTypes(lookup: Lookup<ID>[]) {
        this.sexTypes = lookup;
    }

    @action.bound
    setupOrganizations(lookup: Lookup<ID>[]) {
        this.organizations = lookup;
    }

    @computed get email() {
        return this.patient?.email || "";
    }

    @computed get name() {
        const firstName = this.patient?.first_name ?? "";
        const lastName = this.patient?.last_name ?? "";
        return `${firstName ? `${firstName} ` : ""}${lastName}`;
    }

    @computed get avatar() {
        return this.patient?.profile_photo ?? "";
    }

    @computed get uuid() {
        return this.patient?.uuid ?? "";
    }

    @computed get isStaff() {
        return Boolean(this.patient?.organization_id || this.patient?.position_id);
    }

    @computed get position() {
        return this.patient?.position_id || null;
    }

    @computed get isPatientDeleted() {
        return getIsUserDeleted(this.patient);
    }

    @computed get additionalInformation(): StaffInfo {
        return {
            organization_id: this.patient?.organization_id ?? null,
            position_id: this.patient?.position_id ?? null,
        };
    }
}

export const PatientStoreContext = createContext({
    patientStore: new PatientStore(),
});

interface PatientStoreContextValue {
    patientStore: PatientStore;
}

export const usePatientStore = (): PatientStoreContextValue => useContext(PatientStoreContext);
