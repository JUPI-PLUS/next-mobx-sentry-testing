import React, { forwardRef } from "react";

interface ViewRichTextProps {
    html: string;
    className?: string;
}

const ViewRichText = forwardRef<HTMLDivElement, ViewRichTextProps>(({ html, className, ...rest }, ref) => {
    return (
        <div
            ref={ref}
            className={`rich-text-output ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
});

export default ViewRichText;
