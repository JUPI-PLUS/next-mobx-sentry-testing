import React, { FC } from "react";
import LoginModule from "../../src/modules/Login/LoginModule";
import PublicLayout from "../../src/components/Layouts/PublicLayout/PublicLayout";

const Login: FC = () => {
    return (
        <PublicLayout title="Login">
            <LoginModule />
        </PublicLayout>
    );
};

export default Login;
