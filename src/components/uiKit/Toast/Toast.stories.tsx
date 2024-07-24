import React from "react";
import { Story, Meta } from "@storybook/react";
import ToastContainer from "./ToastContainer";
import ToastContent from "./ToastContent";
import { OutlineButton } from "../Button/Button";
import { showErrorToast, showSuccessToast, showWarningToast } from "./helpers";
import { ToastContentProps } from "./models";

export default {
    title: "uiKit/Toast",
    component: ToastContent,
    args: {
        message:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.",
        title: "My pretty toast message",
        actionText: "Reload",
        // eslint-disable-next-line no-console
        onAction: () => console.log("Reloaded"),
    },
} as Meta;

export const SuccessToast: Story<ToastContentProps> = args => {
    return (
        <>
            <OutlineButton onClick={() => showSuccessToast(args)} text="Show success toast" />
            <ToastContainer />
        </>
    );
};
SuccessToast.storyName = "Success";

export const WarningToast: Story<ToastContentProps> = args => {
    return (
        <>
            <OutlineButton onClick={() => showWarningToast(args)} text="Show warning toast" />
            <ToastContainer />
        </>
    );
};
WarningToast.storyName = "Warning";

export const ErrorToast: Story<ToastContentProps> = args => {
    return (
        <>
            <OutlineButton onClick={() => showErrorToast(args)} text="Show error toast" />
            <ToastContainer />
        </>
    );
};
ErrorToast.storyName = "Error";
