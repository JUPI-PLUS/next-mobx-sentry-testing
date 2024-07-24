import React from "react";

const Dots = () => {
    return (
        <div className="w-5 h-10 flex items-center justify-center select-none" data-testid="pagination-dots">
            <p>...</p>
        </div>
    );
};

export default React.memo(Dots);
