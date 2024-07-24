import { render, screen } from "@testing-library/react";
import Menu from "../Menu";
import { ROUTES } from "../../../../shared/constants/routes";
import { MenuProps } from "../models";
import UserStore from "../../../../shared/store/UserStore";
import { MOCKED_PERMISSIONS_IDS } from "../../../../testingInfrustructure/mocks/users";

const MOCKED_ROUTER_PUSH = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: ROUTES.orders.list.route,
            push: MOCKED_ROUTER_PUSH,
            pathname: ROUTES.orders.list.route
        };
    },
}));

const setup = (props: MenuProps) => {
    render(<Menu {...props} />);
};

describe("Menu component", () => {
    it("Should render component without errors", () => {
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        setup({ isMenuToggled: true, toggle: jest.fn() });
        expect(screen.getByTestId("Dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("Orders")).toBeInTheDocument();
    });
});
