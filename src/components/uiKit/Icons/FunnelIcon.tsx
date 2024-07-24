import React from "react";

const FunnelIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.750022 0C0.446687 0 0.173218 0.182718 0.0571244 0.462958C-0.0589688 0.743198 0.00517482 1.06578 0.219647 1.28029L4.24958 5.3109V9.00002H5.74958V5.31035L9.77896 1.28029C9.99343 1.06578 10.0576 0.743199 9.94148 0.462958C9.82539 0.182718 9.55192 0 9.24858 0H0.750022ZM4.9993 3.93925L2.56047 1.5L7.43814 1.5L4.9993 3.93925Z"
            />
        </svg>
    );
};

export default React.memo(FunnelIcon);
