// libs
import { observer } from "mobx-react";
import { FC } from "react";

// models
import { FolderPathProps } from "./models";

// stores
import { useCreateOrderStore } from "../../../../store";

// components
import CircularProgressLoader from "../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const FolderPath: FC<FolderPathProps> = ({ isFetching, templateParents }) => {
    const {
        createOrderStore: { parentGroupUUID, setupCurrentGroupUUID, cleanupParentGroupUUID },
    } = useCreateOrderStore();

    const onFolderClick = (uuid?: string) => {
        if (templateParents?.length) {
            cleanupParentGroupUUID();
            setupCurrentGroupUUID(uuid ?? "");
        }
    };

    if (isFetching) return <CircularProgressLoader />;

    return (
        <ul className="flex gap-2 pb-3">
            <li
                className={` ${
                    templateParents?.length
                        ? "after:content-['/'] after:ml-2 cursor-pointer text-dark-800"
                        : "text-dark-900"
                }`}
                onClick={() => onFolderClick()}
            >
                Root
            </li>
            {templateParents.map(({ name, uuid }) => (
                <li
                    key={uuid}
                    className={`after:content-['/'] after:ml-2 last:after:content-[''] last:after:ml-0 ${
                        parentGroupUUID === uuid ? "text-dark-900" : "text-dark-800 cursor-pointer"
                    }`}
                    onClick={() => parentGroupUUID !== uuid && onFolderClick(uuid)}
                >
                    {name}
                </li>
            ))}
        </ul>
    );
};
export default observer(FolderPath);
