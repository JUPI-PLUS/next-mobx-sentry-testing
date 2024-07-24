// libs
import React from "react";
import { IMaskMixin } from "react-imask";
import IMask from "imask";
import { ReactElementProps } from "react-imask/dist/mixin";

// models
import { InputProps } from "../../CommonInput/models";

// components
import Input from "../../CommonInput/Input";

const MaskedNumberInput = IMaskMixin<
    IMask.MaskedNumberOptions,
    false,
    string,
    HTMLInputElement,
    ReactElementProps<HTMLInputElement> & InputProps
>(({ inputRef, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Input ref={inputRef as React.MutableRefObject<HTMLInputElement>} {...props} />
));

export default MaskedNumberInput;
