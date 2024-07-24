import React from "react";

const CircleDownloadIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M9.53033 12.4697C9.23744 12.1768 8.76256 12.1768 8.46967 12.4697C8.17678 12.7626 8.17678 13.2374 8.46967 13.5303L9.53033 12.4697ZM12 16L11.4697 16.5303C11.7626 16.8232 12.2374 16.8232 12.5303 16.5303L12 16ZM15.5303 13.5303C15.8232 13.2374 15.8232 12.7626 15.5303 12.4697C15.2374 12.1768 14.7626 12.1768 14.4697 12.4697L15.5303 13.5303ZM12.75 8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8H12.75ZM21.75 12C21.75 6.61522 17.3848 2.25 12 2.25V3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75ZM12 2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75C3.75 7.44365 7.44365 3.75 12 3.75V2.25ZM2.25 12C2.25 17.3848 6.61522 21.75 12 21.75V20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25ZM12 21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25C20.25 16.5563 16.5563 20.25 12 20.25V21.75ZM8.46967 13.5303L11.4697 16.5303L12.5303 15.4697L9.53033 12.4697L8.46967 13.5303ZM12.5303 16.5303L15.5303 13.5303L14.4697 12.4697L11.4697 15.4697L12.5303 16.5303ZM12.75 16V8H11.25V16H12.75Z" />
        </svg>
    );
};

export default React.memo(CircleDownloadIcon);