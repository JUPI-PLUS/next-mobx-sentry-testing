import React, { FC, useState } from "react";
import { InputProps } from "../CommonInput/models";
import Input from "../CommonInput/Input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PasswordInput: FC<InputProps> = props => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    return (
        <Input
            {...props}
            type={isVisible ? "text" : "password"}
            endIcon={
                isVisible ? (
                    <EyeSlashIcon
                        onClick={toggleVisibility}
                        data-testid="hide-password-icon"
                        className="cursor-pointer"
                    />
                ) : (
                    <EyeIcon onClick={toggleVisibility} data-testid="show-password-icon" className="cursor-pointer" />
                )
            }
        />
    );
};

export default PasswordInput;
