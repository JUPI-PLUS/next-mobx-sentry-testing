export const defineLocationProps = (locationProps = {}) => {
    Object.defineProperty(window, "location", {
        value: {
            ...window.location,
            ...locationProps,
        },
        writable: true,
    });
};
