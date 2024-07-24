// libs
import React from "react";

export const ContactsSkeleton = () => (
    <div className="max-h-full w-full h-full grid grid-rows-2 gap-2">
        <ContactsItemSkeleton text="Emails" />
        <ContactsItemSkeleton text="Phone numbers" />
    </div>
);

export const ContactsItemSkeleton = ({ text }: { text: string }) => (
    <div className="p-6 bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg overflow-hidden">
        <div className="max-h-full h-full overflow-hidden flex-grow grid grid-rows-autoFr">
            <p className="font-bold text-md pl-3 pb-6">{text}</p>
            <div className="flex flex-col gap-4 w-full h-full overflow-hidden px-3">
                <div className="w-full h-10 bg-dark-100 rounded animate-pulse" />
                <div className="w-full h-10 bg-dark-100 rounded animate-pulse" />
                <div className="w-full h-10 bg-dark-100 rounded animate-pulse" />
                <div className="w-full h-10 bg-dark-100 rounded animate-pulse" />
                <div className="w-full h-10 bg-dark-100 rounded animate-pulse" />
            </div>
        </div>
    </div>
);
