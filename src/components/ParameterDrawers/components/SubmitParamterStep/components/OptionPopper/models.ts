//  libs
import React, { RefObject } from "react";

//  models
import { Option } from "../../models";

export type OptionDefaultValues = {
    name: CreatableOption | null;
};

export interface OptionPopperProps {
    isOpen: boolean;
    defaultValue?: Option | null;
    items: Option[];
    sourceRef: RefObject<HTMLDivElement>;
    offsetDistance?: number;
    offsetSkidding?: number;
    onClose: () => void;
    onSubmit: (option: Option) => void;
}

export interface OptionFormProps {
    pickedOptions: Option[];
    onClose: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export interface CreatableOption extends Option {
    __isNew__?: boolean;
}
