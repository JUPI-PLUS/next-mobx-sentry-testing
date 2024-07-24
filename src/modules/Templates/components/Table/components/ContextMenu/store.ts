// libs
import { action, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";

// models
import { Template } from "../../../../../../shared/models/business/template";

export class ContextMenuStore {
    // TODO: change public to private
    @observable public contextMenuTemplate: Template | null = null;
    @observable public position: { top: number; left: number } = { top: 0, left: 0 };
    @observable public dropdownDirection: "left" | "right" = "left";
    @observable public transform = "";

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupContextMenuTemplate(template: Template) {
        this.contextMenuTemplate = template;
    }

    @action.bound
    setupContextMenuPosition(clientX: number, clientY: number) {
        this.position.left = clientX;
        this.position.top = clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const halfWindowWidth = windowWidth / 2;
        const halfWindowHeight = windowHeight / 2;
        if (clientX < halfWindowWidth) {
            this.dropdownDirection = "right";
        } else {
            this.dropdownDirection = "left";
        }
        this.transform = `translate(${this.dropdownDirection === "left" ? "-100%" : "0"}, ${
            clientY < halfWindowHeight ? "0" : "-100%"
        })`;
    }

    @action.bound
    cleanup() {
        this.contextMenuTemplate = null;
        this.position = { top: 0, left: 0 };
        this.dropdownDirection = "left";
        this.transform = "";
    }
}

export const ContextMenuStoreContext = createContext({
    contextMenuStore: new ContextMenuStore(),
});

interface ContextMenuStoreContextValue {
    contextMenuStore: ContextMenuStore;
}

export const useContextMenuStore = (): ContextMenuStoreContextValue => useContext(ContextMenuStoreContext);
