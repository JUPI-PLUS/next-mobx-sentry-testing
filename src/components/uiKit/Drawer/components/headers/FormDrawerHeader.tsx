import React, { FC } from "react";
import { DrawerHeaderProps } from "../../models";
import useEsc from "../../../../../shared/hooks/useEsc";
import { useFormContext } from "react-hook-form";
import DrawerHeader from "./DrawerHeader";

const FormDrawerHeader: FC<DrawerHeaderProps> = ({ onClose, couldCloseOnEsc, closeButtonDisabled, ...rest }) => {
    const {
        formState: { isSubmitting },
    } = useFormContext();
    useEsc(couldCloseOnEsc ? onClose : () => {});

    return <DrawerHeader {...rest} closeButtonDisabled={closeButtonDisabled || isSubmitting} onClose={onClose} />;
};

export default FormDrawerHeader;
