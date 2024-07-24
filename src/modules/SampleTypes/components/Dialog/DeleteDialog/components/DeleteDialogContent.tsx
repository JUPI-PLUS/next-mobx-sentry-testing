import React, { FC } from "react";
import CircularProgressLoader from "../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import ExamTemplatesList from "./ExamTemplatesList";
import { DeleteDialogContentProps } from "../../../../models";

const DeleteDialogContent: FC<DeleteDialogContentProps> = ({
    sampleTypeName,
    isDeleteAvailable,
    examTemplatesList,
    isLoading,
}) => {
    if (isLoading)
        return <CircularProgressLoader containerClassName="flex justify-center w-full mt-6 h-full overflow-hidden" />;

    if (isDeleteAvailable)
        return (
            <p>
                Are you sure you want to delete <span className="font-bold">{sampleTypeName}</span> sample type?
            </p>
        );

    return <ExamTemplatesList list={examTemplatesList} sampleTypeName={sampleTypeName} />;
};

export default DeleteDialogContent;
