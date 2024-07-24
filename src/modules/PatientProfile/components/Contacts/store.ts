// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";

// helpers
import { addSecondsToDateNow } from "../../../../shared/utils/date";
import { setVerificationToStorage } from "../../../../shared/utils/verification";

// models
import { ContactActionsEnum } from "./models";
import { VerificationField } from "../../../../components/UserDrawers/VerificationDrawer/models";
import { PhoneContact } from "../../../../shared/models/phones";
import { EmailContact } from "../../../../shared/models/emails";

// constants
import { DEFAULT_VERIFICATION_SECONDS_OFFSET } from "./constants";

export class ContactsStore {
    @observable private _actionType: ContactActionsEnum | null = null;
    @observable private _selectedContact: PhoneContact | EmailContact | null = null;
    @observable private _contactToVerify: VerificationField | null = null;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupActionType(actionType: ContactActionsEnum | null) {
        this._actionType = actionType;
    }

    @action.bound
    setSelectedContact(contact: PhoneContact | EmailContact | null) {
        this._selectedContact = contact;
    }

    @action.bound
    setContactToVerify(item: VerificationField | null) {
        this._contactToVerify = item;
    }

    @action.bound
    setNewContactToVerify(userUUID: string, item: Omit<VerificationField, "targetTime">) {
        const { uuid, value } = item;
        const targetTime = addSecondsToDateNow(DEFAULT_VERIFICATION_SECONDS_OFFSET);
        setVerificationToStorage(userUUID, uuid, targetTime);
        this.setContactToVerify({ uuid, value, targetTime });
    }

    @action.bound
    cleanup() {
        this._actionType = null;
        this._contactToVerify = null;
        this._selectedContact = null;
    }

    @computed
    get actionType() {
        return this._actionType;
    }

    @computed
    get selectedContact() {
        return this._selectedContact;
    }

    @computed
    get contactToVerify() {
        return this._contactToVerify;
    }
}

export const ContactsStoreContext = createContext({
    contactsStore: new ContactsStore(),
});

interface ContactsStoreContextValue {
    contactsStore: ContactsStore;
}

export const useContactsStore = (): ContactsStoreContextValue => useContext(ContactsStoreContext);
