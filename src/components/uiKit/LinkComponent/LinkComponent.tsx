import { FC, MouseEvent } from "react";
import Link from "next/link";
import { LinkComponentProps } from "./models";

const LinkComponent: FC<LinkComponentProps> = ({
    children,
    href,
    aTagProps: { onClick, ...restATagProps } = {},
    ...rest
}) => {
    if (!href) return children;

    const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
        onClick?.(event);
    };

    return (
        <Link href={href} {...rest}>
            <a {...restATagProps} onClick={onLinkClick}>
                {children}
            </a>
        </Link>
    );
};

export default LinkComponent;
