import { FC } from "react";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

export const FiltersSkeleton = () => (
    <div className="flex justify-between">
        <div className="h-10 w-60 bg-dark-100 rounded animate-pulse" />
        <div className="flex gap-6">
            <div className="h-10 w-80 bg-dark-100 rounded animate-pulse" />
            <div className="h-10 w-80 bg-dark-100 rounded animate-pulse" />
            <div className="h-10 w-20 bg-dark-100 rounded animate-pulse" />
        </div>
    </div>
);

export const FolderPathSkeleton: FC<{ isRootFolder: boolean }> = ({ isRootFolder }) => (
    <ul className="flex gap-2 mt-2">
        <li className={isRootFolder ? "" : "text-dark-800"}>Root</li>
        {!isRootFolder && (
            <>
                <li>/</li>
                <li className="h-6 w-14 bg-dark-100 rounded animate-pulse" />
            </>
        )}
    </ul>
);

export const TemplatesTableSkeleton = () => (
    <div className="bg-white p-6 h-full rounded-lg flex flex-col overflow-hidden">
        <CircularProgressLoader containerClassName="flex items-center justify-center w-full h-full" />
    </div>
);
