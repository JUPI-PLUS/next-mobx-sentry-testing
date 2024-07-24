import { useRouter } from "next/router";
import { SolidButton } from "../../../components/uiKit/Button/Button";
import { ROUTES } from "../../../shared/constants/routes";
import React from "react";

const NotFoundModule = () => {
    const router = useRouter();

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div>
                <h1 className="text-center text-2xl mb-4">Not found</h1>
                <SolidButton text="Go to dashboard" onClick={() => router.replace(ROUTES.dashboard.route)} />
            </div>
        </div>
    );
};

export default NotFoundModule;
