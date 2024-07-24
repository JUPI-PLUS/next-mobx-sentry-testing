import React from "react";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import LoginForm from "./LoginForm";
import { useMutation } from "react-query";
import { schema } from "./schema";
import { LoginFormFields, LoginResponse } from "./models";
import { AxiosError, AxiosResponse } from "axios";
import { BaseFormServerValidation } from "../../../../shared/models/axios";
import { removeAuthToken } from "../../../../shared/utils/auth";
import { useRouter } from "next/router";
import { ROUTES } from "../../../../shared/constants/routes";
import { queryClient } from "../../../../../pages/_app";
import { USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { login } from "../../../../api/users";
import { useRootStore } from "../../../../shared/store";
import { observer } from "mobx-react";

const defaultValues = {
    email: "",
    password: "",
};

const LoginFormContainer = () => {
    const { replace } = useRouter();
    const {
        auth: { memorizedRoute, setAccessToken },
    } = useRootStore();

    const { mutate, isError, error } = useMutation<
        AxiosResponse<LoginResponse>,
        AxiosError<BaseFormServerValidation>,
        LoginFormFields
    >(login, {
        onSuccess(successData) {
            removeAuthToken();
            const token = successData.data.access_token;
            setAccessToken(token);
            queryClient.invalidateQueries(USERS_QUERY_KEYS.ME);
            replace(memorizedRoute || ROUTES.dashboard.route);
        },
    });

    const onSubmit = async (formData: LoginFormFields) => {
        await mutate(formData);
    };

    return (
        <FormContainer<LoginFormFields>
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            shouldShowConfirmationDialog={false}
        >
            <div>
                <LoginForm errors={error} isError={isError} />
            </div>
        </FormContainer>
    );
};

export default observer(LoginFormContainer);
