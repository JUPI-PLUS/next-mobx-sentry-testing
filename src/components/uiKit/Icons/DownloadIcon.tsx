import React from "react";

const DownloadIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M5 19.25C4.58579 19.25 4.25 19.5858 4.25 20C4.25 20.4142 4.58579 20.75 5 20.75V19.25ZM19 20.75C19.4142 20.75 19.75 20.4142 19.75 20C19.75 19.5858 19.4142 19.25 19 19.25V20.75ZM12.75 5C12.75 4.58579 12.4142 4.25 12 4.25C11.5858 4.25 11.25 4.58579 11.25 5H12.75ZM12 17L11.4697 17.5303C11.7626 17.8232 12.2374 17.8232 12.5303 17.5303L12 17ZM17.5303 12.5303C17.8232 12.2374 17.8232 11.7626 17.5303 11.4697C17.2374 11.1768 16.7626 11.1768 16.4697 11.4697L17.5303 12.5303ZM7.53033 11.4697C7.23744 11.1768 6.76256 11.1768 6.46967 11.4697C6.17678 11.7626 6.17678 12.2374 6.46967 12.5303L7.53033 11.4697ZM5 20.75H19V19.25H5V20.75ZM11.25 5V17H12.75V5H11.25ZM16.4697 11.4697L11.4697 16.4697L12.5303 17.5303L17.5303 12.5303L16.4697 11.4697ZM12.5303 16.4697L7.53033 11.4697L6.46967 12.5303L11.4697 17.5303L12.5303 16.4697Z" />
        </svg>
    );
};

export default React.memo(DownloadIcon);
