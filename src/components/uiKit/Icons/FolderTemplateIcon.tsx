import React from "react";

const FolderTemplateIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4.18579 8.80859H24.7379C25.8424 8.80859 26.7379 9.70402 26.7379 10.8086V23.9903C26.7379 25.0949 25.8424 25.9903 24.7379 25.9903H6.18579C5.08122 25.9903 4.18579 25.0949 4.18579 23.9903V8.80859Z"
                fill="#EBD2A4"
            />
            <path
                opacity="0.64"
                d="M4.18579 6.12744V8.81038H15.4618L14.1131 5.72671C13.9539 5.36268 13.5942 5.12744 13.1969 5.12744H5.18579C4.63351 5.12744 4.18579 5.57516 4.18579 6.12744Z"
                fill="#B48458"
            />
        </svg>
    );
};

export default React.memo(FolderTemplateIcon);
