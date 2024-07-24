// libs
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { FC } from "react";

// components
import { IconButton } from "../Button/Button";

// models
import { IconButtonProps } from "../Button/models";

const BackButton: FC<Partial<IconButtonProps>> = ({ className = "", ...rest }) => {
    const router = useRouter();

    return (
        <IconButton
            className={`rounded-full py-2 px-2 ${className}`}
            variant="neutral"
            size="thin"
            onClick={() => router.back()}
            {...rest}
        >
            <ArrowLeftIcon className="w-6 h-6 text-dark-900" />
        </IconButton>
    );
};

export default BackButton;
