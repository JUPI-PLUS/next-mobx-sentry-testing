import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "../../shared/store";
import Image from "next/image";
import ActivitiesImage from "public/images/Activities.png";
import OrdersAnalyticsImage from "public/images/Orders Analytics.png";
import BirthdaysImage from "public/images/Birthdays.png";

const DashboardModule = () => {
    const {
        user: { name },
    } = useRootStore();

    return (
        <div className="grid grid-row-7 px-6">
            <div className="row-span-2 flex items-center justify-center text-3xl font-bold break-word">
                Welcome, {name}!
            </div>
            <div className="row-span-4 grid grid-cols-3 gap-1">
                <div className="bg-white rounded-md p-6 shadow-dashboard-card">
                    <h3 className="text-md font-bold">News and activities</h3>
                    <div className="grid grid-row-2 h-full auto-rows-fr">
                        <div className="flex items-end justify-center">
                            <Image
                                src={ActivitiesImage}
                                alt="Coffee standing next to the book"
                                width={160}
                                height={100}
                                placeholder="blur"
                            />
                        </div>
                        <div className="mt-10 text-center">
                            <h2 className="text-xl font-medium text-dark-800">This widget is under construction</h2>
                            <p className="text-md mt-4 text-dark-800">We’re working on it!</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-dashboard-card">
                    <h3 className="text-md font-bold">Orders Analytics</h3>
                    <div className="grid grid-row-2 h-full auto-rows-fr">
                        <div className="flex items-end justify-center">
                            <Image
                                src={OrdersAnalyticsImage}
                                alt="Lightning stands in front of a notebook"
                                width={96}
                                height={132}
                                placeholder="blur"
                            />
                        </div>
                        <div className="mt-10 text-center">
                            <h2 className="text-xl font-medium text-dark-800">This widget is under construction</h2>
                            <p className="text-md mt-4 text-dark-800">We’re working on it!</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 shadow-dashboard-card">
                    <h3 className="text-md font-bold">This month birthdays</h3>
                    <div className="grid grid-row-2 h-full auto-rows-fr">
                        <div className="flex items-end justify-center">
                            <Image
                                src={BirthdaysImage}
                                alt="Two text clouds in a row"
                                width={144}
                                height={118}
                                placeholder="blur"
                            />
                        </div>
                        <div className="mt-10 text-center">
                            <h2 className="text-xl font-medium text-dark-800">This widget is under construction</h2>
                            <p className="text-md mt-4 text-dark-800">We’re working on it!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row-span-1" />
        </div>
    );
};

export default observer(DashboardModule);
