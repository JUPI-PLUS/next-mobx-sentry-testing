import { LinkProps } from "next/link";
import { ReactElement, AnchorHTMLAttributes } from "react";

export type LinkComponentProps = Omit<LinkProps, "href"> & {
    children: ReactElement;
    href?: LinkProps["href"];
    aTagProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
};
