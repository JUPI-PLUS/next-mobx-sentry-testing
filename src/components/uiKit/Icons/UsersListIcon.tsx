import React from "react";

const UsersListIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M17.5 7.25C17.0858 7.25 16.75 7.58579 16.75 8C16.75 8.41421 17.0858 8.75 17.5 8.75V7.25ZM22 8.75C22.4142 8.75 22.75 8.41421 22.75 8C22.75 7.58579 22.4142 7.25 22 7.25V8.75ZM17.5 8.75H22V7.25H17.5V8.75Z"
                fill="#071730"
            />
            <path
                d="M17.5 11.25C17.0858 11.25 16.75 11.5858 16.75 12C16.75 12.4142 17.0858 12.75 17.5 12.75V11.25ZM22 12.75C22.4142 12.75 22.75 12.4142 22.75 12C22.75 11.5858 22.4142 11.25 22 11.25V12.75ZM17.5 12.75H22V11.25H17.5V12.75Z"
                fill="#071730"
            />
            <path
                d="M19.5 15.25C19.0858 15.25 18.75 15.5858 18.75 16C18.75 16.4142 19.0858 16.75 19.5 16.75V15.25ZM22 16.75C22.4142 16.75 22.75 16.4142 22.75 16C22.75 15.5858 22.4142 15.25 22 15.25V16.75ZM19.5 16.75H22V15.25H19.5V16.75Z"
                fill="#071730"
            />
            <circle
                cx="9"
                cy="8"
                r="4.5"
                stroke="#071730"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 18.75C3 17.355 3 16.6576 3.15333 16.0853C3.56944 14.5324 4.7824 13.3194 6.33531 12.9033C6.90756 12.75 7.60504 12.75 9 12.75V12.75C10.395 12.75 11.0924 12.75 11.6647 12.9033C13.2176 13.3194 14.4306 14.5324 14.8467 16.0853C15 16.6576 15 17.355 15 18.75V20.25H3V18.75Z"
                stroke="#071730"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default React.memo(UsersListIcon);
