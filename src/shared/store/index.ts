import { createContext, useContext } from "react";
import AuthStore from "./AuthStore";
import UserStore from "./UserStore";
import MenuStore from "../../components/Layouts/Menu/store";

export class RootStore {
    auth = AuthStore;
    user = UserStore;
    menu = MenuStore;
}

export const store = new RootStore();

export const RootStoreContext = createContext<RootStore>(store);

export const useRootStore = () => useContext(RootStoreContext);
