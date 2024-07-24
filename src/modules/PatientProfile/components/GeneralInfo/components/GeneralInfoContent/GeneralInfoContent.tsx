// libs
import { FC } from "react";

// models
import { FormWithValidationProps } from "../../models";

// components
import MainInfo from "../MainInfo/MainInfo";
import AdditionInfo from "../AdditionInfo/AdditionInfo";

const GeneralInfoContent: FC<FormWithValidationProps> = ({ isError, errors }) => {
    return (
        <div className="flex-1 max-h-full grid grid-cols-frAutoFr grid-rows-autoFr overflow-y-auto gap-x-8 gap-y-4 px-8 py-6">
            <div className="font-bold col-start-1 col-end-2">Main information</div>
            <div className="font-bold col-start-3 col-end-4">Addition information</div>
            <MainInfo isError={isError} errors={errors} />
            <div className="w-px bg-dark-500" />
            <AdditionInfo isError={isError} errors={errors} />
        </div>
    );
};

export default GeneralInfoContent;
