// libs
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { FC } from "react";

// models
import { FolderPathProps } from "../../../../models";

// stores
import { useTemplatesStore } from "../../../../store";

// components
import { FolderPathSkeleton } from "../../../Skeletons";

const FolderPath: FC<FolderPathProps> = ({ isFetching, templateParents }) => {
    const {
        templatesStore: { parentGroupUUID, templatesFiltersQueryString },
    } = useTemplatesStore();

    const {
        push,
        query: { folder },
    } = useRouter();

    const onFolderClick = (uuid?: string) => {
        if (templateParents?.length) push({ query: uuid ? { folder: uuid } : {} });
    };

    if (templatesFiltersQueryString) return null;

    if (isFetching) return <FolderPathSkeleton isRootFolder={!folder} />;

    return (
        <ul className="flex gap-2 mt-2">
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
