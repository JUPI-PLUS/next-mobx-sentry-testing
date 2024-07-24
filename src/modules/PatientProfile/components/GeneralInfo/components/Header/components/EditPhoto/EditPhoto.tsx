// libs
import { useRef } from "react";

// hooks
import { useDisclosure } from "../../../../../../../../shared/hooks/useDisclosure";

// components
import { TextButton } from "../../../../../../../../components/uiKit/Button/Button";
import Popper from "../../../../../../../../components/uiKit/Popper/Popper";
import EditPhotoDropdown from "./components/EditPhotoDropdown/EditPhotoDropdown";

const EditPhoto = () => {
    const avatarRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="relative">
            <Popper
                offsetDistance={5}
                offsetSkidding={-5}
                placement="bottom-start"
                isOpen={isOpen}
                onClose={onClose}
                sourceRef={avatarRef}
            >
                <EditPhotoDropdown />
            </Popper>
            <TextButton
                text="Edit photo"
                ref={avatarRef}
                onClick={onOpen}
                variant="transparent"
                type="button"
                size="thin"
                className="underline"
            />
        </div>
    );
};

export default EditPhoto;
