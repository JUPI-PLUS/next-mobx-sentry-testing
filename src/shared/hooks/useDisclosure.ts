import { useCallback, useState } from "react";

export const useDisclosure = (defaultOpen = false) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const onClose = useCallback(() => setIsOpen(false), []);

    const onOpen = useCallback(() => setIsOpen(true), []);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, onClose, onOpen, toggle };
};
