import React from "react";

const EmailIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M21.5 18V6C21.5 4.89543 20.6046 4 19.5 4H4.5C3.39543 4 2.5 4.89543 2.5 6V18C2.5 19.1046 3.39543 20 4.5 20H19.5C20.6046 20 21.5 19.1046 21.5 18Z"
                strokeWidth="1.5"
            />
            <path
                d="M21.5 9.00342L12.9315 13.5132C12.3484 13.82 11.6516 13.82 11.0685 13.5132L2.5 9.00342"
                strokeWidth="1.5"
            />
        </svg>
    );
};

export default React.memo(EmailIcon);
