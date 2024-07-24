import { MouseEvent, MouseEventHandler } from "react";
import Router from "next/router";
import { MIDDLE_MOUSE_BUTTON } from "../constants/events";

// the middle mouse click calls onClick & opens the new tab and the left mouse button calls onClick & opens in the current tab
// which means inTheNewTab and inTheCurrentTab will be divided
export const onMiddleMouseDown =
    <T extends HTMLElement>(onMiddleMouseClick: () => void): MouseEventHandler<T> =>
    e =>
        e.button === MIDDLE_MOUSE_BUTTON && onMiddleMouseClick();

export const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
};

export const onLinkButtonClick = (onClickAction: () => void, route: string, isNewTab = false) => {
    onClickAction();

    if (isNewTab) {
        openInNewTab(route);
        return;
    }
    Router.push(route);
};

export const preventClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
};
