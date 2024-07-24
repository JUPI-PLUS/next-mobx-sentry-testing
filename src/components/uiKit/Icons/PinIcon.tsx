import React from "react";

const PinIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M11.6918 0C12.5672 0 13.0201 1.04528 12.4213 1.68394L7.22954 7.22183C6.83446 7.64324 6.16554 7.64324 5.77046 7.22183L0.578696 1.68394C-0.0200534 1.04528 0.432792 0 1.30823 0H11.6918Z" />
        </svg>
    );
};

export default React.memo(PinIcon);
