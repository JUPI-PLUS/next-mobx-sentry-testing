import React from "react";
import { CircularProgressLoader } from "../CircularProgressLoader/CircularProgressLoader";

const FullPageLoading = () => {
    return (
        <div
            className="absolute top-0 left-0 right-0 bottom-0 z-50 w-full h-full flex justify-center items-center"
            data-testid="full-page-loading"
        >
            <CircularProgressLoader />
        </div>
    );
};

export default FullPageLoading;
