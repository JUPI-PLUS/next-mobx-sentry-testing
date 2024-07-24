// libs
import { FC, useMemo } from "react";

// models
import { RoleDetailsCardProps } from "./models";

// components
import FocusableBlock from "../../../../../../components/uiKit/FocusableBlock/FocusableBlock";

const RoleDetailsCard: FC<RoleDetailsCardProps> = ({ onClick, roleName = "", isSelected }) => {
    const containerClassname = useMemo(
        () => (isSelected ? "text-white bg-brand-100" : "text-dark-900 bg-white"),
        [isSelected]
    );

    return (
        <FocusableBlock
            className={`border border-inset border-dark-300 flex items-center py-5 px-4 max-w-xs text-base font-medium rounded-lg shadow-card-shadow transition-colors ${containerClassname}`}
            data-testid={`role-details-card-${roleName}`}
            onClick={onClick}
        >
            <span className="text-md font-bold">{roleName}</span>
        </FocusableBlock>
    );
};

export default RoleDetailsCard;
