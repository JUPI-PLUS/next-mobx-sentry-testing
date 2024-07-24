import React from "react";
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import DashboardModule from "../../src/modules/Dashboard/DashboardModule";

const Dashboard = () => {
    return (
        <PrivateLayout title="Dashboard" thin>
            <DashboardModule />
        </PrivateLayout>
    );
};

export default Dashboard;
