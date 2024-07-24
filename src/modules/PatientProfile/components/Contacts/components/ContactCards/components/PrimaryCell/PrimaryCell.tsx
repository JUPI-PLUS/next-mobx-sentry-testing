// libs
import React from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

// api
import { setEmailPrimary } from "../../../../../../../../api/emails";
import { setPhonePrimary } from "../../../../../../../../api/phones";

// helpers
import { queryClient } from "../../../../../../../../../pages/_app";

// models
import { PrimaryCellProps } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../shared/models/axios";

// constants
import { CONTACT_TYPES } from "../../../../constants";
import { EMAILS_QUERY_KEYS, PHONES_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";

// components
import Radio from "../../../../../../../../components/uiKit/forms/Radio/Radio";
import { showErrorToast, showSuccessToast } from "../../../../../../../../components/uiKit/Toast/helpers";
import { Tooltip } from "../../../../../../../../components/uiKit/Tooltip/Tooltip";

const PrimaryCell = ({ isPrimary, isVerified, userUUID, uuid, type }: PrimaryCellProps) => {
    const { mutateAsync: mutateAsyncSetEmailPrimary } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(setEmailPrimary(uuid), {
        onSuccess: () => {
            showSuccessToast({ title: "Email has been set to primary" });
        },
        onError: () => {
            showErrorToast({ title: "Email has already been deleted" });
        },
        onSettled: async () => {
            await queryClient.refetchQueries(EMAILS_QUERY_KEYS.LIST(userUUID));
        },
    });

    const { mutateAsync: mutateAsyncSetPhonePrimary } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(setPhonePrimary(uuid), {
        onSuccess: () => {
            showSuccessToast({ title: "Phone number has been set to primary" });
        },
        onError: () => {
            showErrorToast({ title: "Phone number has already been deleted" });
        },
        onSettled: async () => {
            await queryClient.refetchQueries(PHONES_QUERY_KEYS.LIST(userUUID));
        },
    });

    const onChangeIsPrimary = async () => {
        if (isPrimary) return;
        try {
            if (type === CONTACT_TYPES.EMAIL) {
                await mutateAsyncSetEmailPrimary();
            } else {
                await mutateAsyncSetPhonePrimary();
            }
        } catch (e) {}
    };

    const isPrimarySetupOptionDisabled = !isVerified && !isPrimary;

    return (
        <div className="flex items-center pl-0.5 py-2">
            <Tooltip
                text={`You can not set this ${type} as primary, it's not verified`}
                enabled={isPrimarySetupOptionDisabled}
                isStatic
                placement="bottom"
                offsetDistance={15}
            >
                <Radio
                    data-testid={`contact-primary-${uuid}`}
                    checked={isPrimary}
                    value={uuid}
                    onChange={() => {}}
                    onClick={onChangeIsPrimary}
                    disabled={isPrimarySetupOptionDisabled}
                />
            </Tooltip>
        </div>
    );
};

export default PrimaryCell;
