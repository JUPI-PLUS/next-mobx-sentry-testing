// libs
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

// models
import { AdditionalInformationProps } from "./models";

// components
import FormInput from "../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormRichText from "../../../../components/uiKit/RichText/FormRichText";

const AdditionalInformation: FC<AdditionalInformationProps> = ({ isDisabled }) => {
    const {
        formState: { isSubmitting },
    } = useFormContext();

    if (isDisabled) return null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <p className="font-bold mb-5">Supplemental info</p>
            <div className="flex flex-col gap-4">
                <FormInput
                    name="referral_doctor"
                    label="Referral doctor"
                    data-testid="referral-doctor"
                    disabled={isSubmitting}
                />
                <FormRichText
                    name="referral_notes"
                    label="Notes"
                    data-testid="referral-notes"
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
};

export default AdditionalInformation;
