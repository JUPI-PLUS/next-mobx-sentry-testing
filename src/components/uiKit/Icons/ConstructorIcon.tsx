import React from "react";

const ConstructorIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.25 6.25H8.75V4.75H6.25V6.25ZM10.25 6.25V4C10.25 3.58579 9.91421 3.25 9.5 3.25H5.5C5.08579 3.25 4.75 3.58579 4.75 4V6.25H3C2.58579 6.25 2.25 6.58579 2.25 7V19C2.25 19.4142 2.58579 19.75 3 19.75H21C21.4142 19.75 21.75 19.4142 21.75 19V7C21.75 6.58579 21.4142 6.25 21 6.25H19.25V4C19.25 3.58579 18.9142 3.25 18.5 3.25H14.5C14.0858 3.25 13.75 3.58579 13.75 4V6.25H10.25ZM14.5 7.75H18.5H20.25V12.25H3.75V7.75H5.5H9.5H14.5ZM3.75 13.75V18.25H20.25V13.75H3.75ZM17.75 4.75V6.25H15.25V4.75H17.75Z"
            />
        </svg>
    );
};

export default React.memo(ConstructorIcon);
