import React, { forwardRef, useMemo } from "react";
import { ButtonProps, IconButtonProps } from "./models";
import { onMiddleMouseDown } from "../../../shared/utils/events";

const BaseButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ startIcon, endIcon, text, size, className = "", onMiddleMouseClick, ...rest }, ref) => {
        const buttonSizeClassName = useMemo(() => {
            switch (size) {
                case "thin":
                    return "text-md font-bold";
                case "xs":
                    return "px-3.5 py-1 font-bold text-md";
                case "sm":
                    return "px-[18px] text-md font-bold py-2";
                case "lg":
                    return "px-6 py-4";
                default:
                    return "px-6 text-md font-bold py-3";
            }
        }, [size]);

        return (
            <button
                aria-label={text?.toString() || rest.variant}
                aria-disabled={rest.disabled}
                {...rest}
                {...(onMiddleMouseClick && { onMouseDown: onMiddleMouseDown(onMiddleMouseClick) })}
                ref={ref}
                className={`${className} ${buttonSizeClassName} rounded-md cursor-pointer disabled:cursor-not-allowed transition-all ease-in-out flex items-center`}
            >
                {startIcon && <span className="mr-2">{startIcon}</span>}
                {text}
                {endIcon && <span className="ml-2">{endIcon}</span>}
            </button>
        );
    }
);

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant, ...rest }, ref) => {
    const buttonVariantClassName = useMemo(() => {
        switch (variant) {
            case "error":
                return "ring-red-400 ring-inset text-red-400 disabled:bg-red-200 hover:bg-red-50";
            case "neutral":
                return "ring-gray-400 ring-inset text-gray-400 disabled:bg-gray-200 hover:bg-gray-50";
            case "warning":
                return "ring-yellow-400 ring-inset text-yellow-400 disabled:bg-yellow-200 hover:bg-yellow-50";
            default:
                return "ring-brand-100 ring-inset text-brand-100 disabled:ring-dark-100 disabled:bg-dark-300 disabled:ring-dark-100 disabled:text-dark-700 hover:bg-brand-200 hover:text-white";
        }
    }, [variant]);

    return <BaseButton {...rest} ref={ref} className={`${className} ring-1 ${buttonVariantClassName}`} />;
});

export const SolidButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant, ...rest }, ref) => {
    const buttonVariantClassName = useMemo(() => {
        switch (variant) {
            case "error":
                return "bg-red-400 text-white disabled:bg-red-200 hover:bg-error-500";
            case "neutral":
                return "bg-gray-400 text-white disabled:bg-gray-200 hover:bg-gray-500";
            case "warning":
                return "bg-yellow-400 text-black disabled:bg-yellow-200 hover:bg-yellow-500";
            default:
                return "bg-brand-100 text-white disabled:bg-dark-300 disabled:text-dark-700 hover:bg-brand-200";
        }
    }, [variant]);

    return <BaseButton {...rest} className={`${className} ${buttonVariantClassName}`} ref={ref} />;
});

export const TextButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant, ...rest }, ref) => {
    const buttonVariantClassName = useMemo(() => {
        switch (variant) {
            case "error":
                return "text-red-400 disabled:text-red-200 hover:bg-red-50";
            case "neutral":
                return "text-dark-900 disabled:text-gray-200 hover:underline";
            case "warning":
                return "text-yellow-400 disabled:text-yellow-200 hover:bg-yellow-50";
            case "transparent":
                return "";
            default:
                return "text-blue-400 disabled:text-blue-200 hover:bg-blue-50";
        }
    }, [variant]);

    return <BaseButton {...rest} ref={ref} className={`${className} ${buttonVariantClassName}`} />;
});

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className = "", size, variant, children, onMiddleMouseClick, ...rest }, ref) => {
        {
            const buttonVariantClassName = useMemo(() => {
                switch (variant) {
                    case "error":
                        return "text-red-500 disabled:text-red-200 hover:bg-red-200";
                    case "neutral":
                        return "text-gray-500 disabled:text-gray-200 hover:bg-gray-200";
                    case "warning":
                        return "text-yellow-500 disabled:text-yellow-200 hover:bg-yellow-200";
                    case "transparent":
                        return "";
                    default:
                        return "text-blue-500 disabled:text-blue-200 hover:bg-blue-200";
                }
            }, [variant]);

            const buttonSizeClassName = useMemo(() => {
                switch (size) {
                    case "sm":
                        return "px-2 py-1";
                    case "lg":
                        return "px-6 py-4";
                    case "thin":
                        return "p-0";
                    default:
                        return "px-3 p-2";
                }
            }, [size]);

            return (
                <button
                    aria-disabled={rest.disabled}
                    {...rest}
                    {...(onMiddleMouseClick && { onMouseDown: onMiddleMouseDown(onMiddleMouseClick) })}
                    className={`${className} ${buttonSizeClassName} ${buttonVariantClassName} transition-colors ease-in-out flex items-center`}
                    ref={ref}
                >
                    {children}
                </button>
            );
        }
    }
);
