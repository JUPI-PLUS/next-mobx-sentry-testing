import React from "react";

const HomeIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5574 1.39452C11.821 1.20183 12.179 1.20183 12.4426 1.39452L21.4426 7.97347C21.6358 8.11469 21.75 8.33964 21.75 8.57895V20C21.75 20.4142 21.4142 20.75 21 20.75H14.5C14.0858 20.75 13.75 20.4142 13.75 20V14.0658H10.25V20C10.25 20.4142 9.91421 20.75 9.5 20.75H3C2.58579 20.75 2.25 20.4142 2.25 20V8.57895C2.25 8.33964 2.3642 8.11469 2.5574 7.97347L11.5574 1.39452ZM3.75 8.95972V19.25H8.75V13.3158C8.75 12.9016 9.08579 12.5658 9.5 12.5658H14.5C14.9142 12.5658 15.25 12.9016 15.25 13.3158V19.25H20.25V8.95972L12 2.92902L3.75 8.95972Z"
            />
        </svg>
    );
};

export default React.memo(HomeIcon);
