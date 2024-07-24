import { FC } from "react";
import UserAvatar from "../../Layouts/Menu/components/Avatar/UserAvatar";
import { HeaderProps } from "./models";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";
import LinkComponent from "../LinkComponent/LinkComponent";

const Header: FC<HeaderProps> = ({ title = "" }) => {
    return (
        <header
            className="flex justify-between w-full py-2.5 pl-5 pr-6 border-b border-inset border-dark-400 bg-white"
            data-testid="header"
        >
            <LinkComponent href={{ pathname: "/" }} aTagProps={{ className: "flex" }}>
                <span className="flex">
                    <img
                        src="https://imagedelivery.net/vO8gq8K28jAqmnRdcjnTkg/8a82f6fe-1fd1-4dc6-f7ef-010b6a411c00/public"
                        alt="enverlims logo"
                        className="cursor-pointer"
                    />
                </span>
            </LinkComponent>
            <ErrorBoundary>
                <div className="flex items-center">
                    <span className="text-dark-900 text-sm mr-3 break-word">{title}</span>
                    <UserAvatar />
                </div>
            </ErrorBoundary>
        </header>
    );
};

export default Header;
