// libs
import React, { FC } from "react";
import { observer } from "mobx-react";

// models
import { ParamItemProps } from "./models";

//  constants
import { ROUTES } from "../../../../../../../../../shared/constants/routes";

// components
import { OutlineButton } from "../../../../../../../../../components/uiKit/Button/Button";
import LinkComponent from "../../../../../../../../../components/uiKit/LinkComponent/LinkComponent";

const ParamItem: FC<ParamItemProps> = ({ uuid, name, code }) => {
    return (
        <li
            className="grid grid-cols-4 py-4 px-5 items-center border border-inset border-dark-600 rounded-md"
            data-testid={`param-item-${uuid}`}
        >
            <div className="col-span-3">
                <div className="flex items-center leading-snug">
                    <div className="text-sm text-dark-800 mr-2">{code}</div>
                </div>
                <div className="text-md mt-2 text-dark-900 break-word">{name}</div>
            </div>
            <div className="col-span-1">
                <LinkComponent
                    href={{ pathname: ROUTES.parameters.route, query: { page: 1 }, hash: uuid }}
                    aTagProps={{ target: "_blank" }}
                >
                    <OutlineButton type="button" text="Browse" className="ml-auto" />
                </LinkComponent>
            </div>
        </li>
    );
};

export default observer(ParamItem);
