// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useOrdersStore } from "../../store";

// helpers
import { getIsUserDeleted } from "../../../../shared/utils/user";

// models
import { OrdersPermission, ProfilePermission } from "../../../../shared/models/permissions";

// constants
import { ROUTES } from "../../../../shared/constants/routes";

// components
import { XMarkIcon } from "@heroicons/react/24/solid";
import { IconButton, OutlineButton, SolidButton } from "../../../../components/uiKit/Button/Button";
import PermissionAccessElement from "../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";
import UserDetails from "../../../../components/UserDetails/UserDetails";

const OrderUserDetails = () => {
    const {
        ordersStore: { activeUser, setupActiveUser },
    } = useOrdersStore();

    const isUserDeleted = getIsUserDeleted(activeUser);

    if (!activeUser) return null;

    return (
        <div className="w-full px-6 py-5 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex items-center">
                <UserDetails user={activeUser} />
                <div className="ml-auto flex gap-x-3 shrink-0">
                    {!isUserDeleted && (
                        <>
                            <PermissionAccessElement required={[ProfilePermission.VIEW_ONE]}>
                                <LinkComponent
                                    href={{
                                        pathname: ROUTES.patientProfile.route,
                                        query: { patientUUID: activeUser.uuid },
                                    }}
                                >
                                    <OutlineButton text="View profile" size="sm" data-testid="view-profile-link" />
                                </LinkComponent>
                            </PermissionAccessElement>
                            <PermissionAccessElement required={[OrdersPermission.CREATE]}>
                                <LinkComponent
                                    href={{
                                        pathname: ROUTES.createOrder.activation.route,
                                        query: { userId: activeUser.uuid },
                                    }}
                                >
                                    <OutlineButton text="Activate kit" size="sm" data-testid="activate-kit-link" />
                                </LinkComponent>
                            </PermissionAccessElement>
                            <PermissionAccessElement required={[OrdersPermission.CREATE]}>
                                <LinkComponent
                                    href={{ pathname: ROUTES.createOrder.route, query: { userId: activeUser.uuid } }}
                                >
                                    <SolidButton text="Add order" size="sm" data-testid="add-order-link" />
                                </LinkComponent>
                            </PermissionAccessElement>
                        </>
                    )}

                    <IconButton
                        aria-label="Close patient orders"
                        className="ring-1 ring-dark-600 ring-inset w-10 h-10 rounded-lg justify-center"
                        variant="neutral"
                        size="thin"
                        onClick={() => setupActiveUser(null)}
                        data-testid="close-patient-orders-button"
                    >
                        <XMarkIcon className="w-4 h-4 text-dark-900 stroke-2" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default observer(OrderUserDetails);
