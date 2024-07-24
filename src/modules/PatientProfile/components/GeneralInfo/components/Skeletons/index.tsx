export const GeneralInfoContainerSkeleton = () => (
    <div className="h-full w-full flex flex-col bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg divide-y divide-dark-500 overflow-hidden bg-dark-100 animate-pulse">
        <div className="my-4 h-14"></div>
        <div className="flex-1 grid grid-cols-frAutoFr grid-rows-autoFr gap-x-8 gap-y-4 px-8 py-6">
            <div className="font-bold col-start-1 col-end-2">Main information</div>
            <div className="font-bold col-start-3 col-end-4">Addition information</div>
            <div />
            <div className="w-px bg-dark-500" />
            <div />
        </div>
        <div className="p-4 flex justify-end">
            <div className="h-10" />
        </div>
    </div>
);
