import React, { FC } from "react";
import CircularProgressLoader from "../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { DeleteDialogContentProps } from "../../models";
import RelationsList from "./RelationsList/RelationsList";

const DeleteDialogContent: FC<DeleteDialogContentProps> = ({
    measureUnitName,
    isDeleteAvailable,
    examTemplatesList,
    paramsList,
    isLoading,
}) => {
    if (isLoading)
        return <CircularProgressLoader containerClassName="flex justify-center w-full mt-6 h-full overflow-hidden" />;

    if (isDeleteAvailable)
        return (
            <p>
                Are you sure you want to delete <span className="font-bold">{measureUnitName}</span> measure unit?
            </p>
        );

    return (
        <RelationsList
            examTemplatesList={examTemplatesList}
            paramsList={paramsList}
            measureUnitName={measureUnitName}
        />
    );
};

export default DeleteDialogContent;
