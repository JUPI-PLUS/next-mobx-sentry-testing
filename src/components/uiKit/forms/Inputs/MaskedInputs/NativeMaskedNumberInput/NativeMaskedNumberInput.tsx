// libs
import React, { InputHTMLAttributes } from "react";
import { IMaskMixin } from "react-imask";
import IMask from "imask";
import { ReactElementProps } from "react-imask/dist/mixin";

const NativeMaskedNumberInput = IMaskMixin<
    IMask.MaskedNumberOptions,
    false,
    string,
    HTMLInputElement,
    ReactElementProps<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>
>(({ inputRef, ...props }) => <input ref={inputRef as React.MutableRefObject<HTMLInputElement>} {...props} />);

export default NativeMaskedNumberInput;
