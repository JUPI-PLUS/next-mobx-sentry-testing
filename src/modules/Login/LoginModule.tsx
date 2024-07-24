import React from "react";
import LoginFormContainer from "./components/LoginForm/LoginFormContainer";
import Image from "next/image";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

const LoginModule = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="h-full max-w-4xl w-full grid grid-cols-[280px_1fr] shadow-card-shadow rounded-md bg-white grid-rows-1">
                <div className="relative">
                    <div className="relative w-full h-full">
                        <Image src="/login-cover.png" alt="waves background" layout="fill" className="rounded-l-md" />
                        <div className="w-6 h-48 absolute bottom-8 left-8">
                            <Image src="/login-logo.svg" alt="enverlims logo" layout="fill" />
                        </div>
                    </div>
                </div>
                <div className="p-20">
                    <h2 className="mb-6 text-2xl">Login</h2>
                    <ErrorBoundary>
                        <LoginFormContainer />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default LoginModule;
