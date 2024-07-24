import React, { ChangeEvent } from "react";
import FormInput from "../../../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormRichText from "../../../../../../../../components/uiKit/RichText/FormRichText";
import { useCreateOrderStore } from "../../../../../../store";
import { observer } from "mobx-react";

const AdditionalInformation = () => {
    const {
        createOrderStore: { setupAdditionalOrderInformation },
    } = useCreateOrderStore();
    const onReferralDoctorChange = (event: ChangeEvent<HTMLInputElement>) => {
        setupAdditionalOrderInformation("referral_doctor", event.target.value);
    };

    const onReferralNotesChange = (notes: string) => {
        setupAdditionalOrderInformation("referral_notes", notes);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold">Supplemental info</p>
            </div>
            <div className="mt-4">
                <div>
                    <FormInput
                        name="referral_doctor"
                        label="Referral doctor"
                        data-testid="referral-doctor"
                        onChange={onReferralDoctorChange}
                    />
                </div>
                <div className="mt-3">
                    <FormRichText
                        name="referral_notes"
                        label="Notes"
                        data-testid="referral-notes"
                        onChange={onReferralNotesChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(AdditionalInformation);
