// libs
import React, { FC } from "react";

// components
import Badge from "../../../../../../uiKit/Badge/Badge";

// models
import { GroupTitleProps } from "./models";

const GroupTitle: FC<GroupTitleProps> = ({ index, isDefault }) => {
    const count = index + 1;

    if (isDefault) {
        return (
            <div className="flex items-center">
                <p className="mr-1.5">Group {count}</p>
                <Badge text="DEFAULT" variant="success" />
            </div>
        );
    }

    return <p>Group {count}</p>;
};

export default React.memo(GroupTitle);
