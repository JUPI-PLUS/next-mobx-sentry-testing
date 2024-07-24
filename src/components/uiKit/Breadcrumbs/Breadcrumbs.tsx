import { FC } from "react";
import { BreadcrumbsProps } from "./models";
import BackButton from "./BackButton";

const Breadcrumbs: FC<BreadcrumbsProps> = ({ label = "" }) => {
    return (
        <div className="flex items-center" data-testid="breadcrumbs">
            <BackButton aria-label={label} />
            <h1 className="text-xl ml-2 font-bold text-dark-900 leading-6" data-testid="breadcrumbsLabel">
                {label}
            </h1>
        </div>
    );
};

export default Breadcrumbs;
