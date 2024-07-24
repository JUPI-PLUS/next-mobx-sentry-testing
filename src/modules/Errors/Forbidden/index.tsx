import React from "react";
import { SolidButton } from "../../../components/uiKit/Button/Button";
import { useRouter } from "next/router";
import { ROUTES } from "../../../shared/constants/routes";

const ForbiddenModule = () => {
    const router = useRouter();

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div>
                <h1 className="text-center text-2xl mb-4">Forbidden</h1>
                <SolidButton text="Go to dashboard" onClick={() => router.replace(ROUTES.dashboard.route)} />
            </div>
        </div>
    );
};

export default ForbiddenModule;
