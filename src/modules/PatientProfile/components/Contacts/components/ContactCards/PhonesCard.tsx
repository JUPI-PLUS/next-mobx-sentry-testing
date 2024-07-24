// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../store";

// api
import { getPhoneTypes } from "../../../../../../api/dictionaries";
import { getPhonesList } from "../../../../../../api/phones";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";

// models
import { ContactActionsEnum, ContactCardProps } from "../../models";
import { CustomColumn } from "../../../../../../components/Table/models";
import { PhoneContact } from "../../../../../../shared/models/phones";

// constants
import { DICTIONARIES_QUERY_KEYS, PHONES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { CONTACT_TYPES, MAX_PHONE_NUMBER } from "../../constants";

// components
import Table from "../../../Table";
import ActionsCell from "./components/ActionsCell/ActionsCell";
// import VerificationCell from "./components/VerificationCell/VerificationCell";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import ContactsPlaceholder from "./components/EmptyContacts/ContactsPlaceholder";
import PhoneCell from "./components/PhoneCell/PhoneCell";
import PrimaryCell from "./components/PrimaryCell/PrimaryCell";
import { ContactsItemSkeleton } from "../Skeletons";

const PhonesCard = ({ uuid }: ContactCardProps) => {
    const type = CONTACT_TYPES.PHONE;
    const {
        contactsStore: { setupActionType },
    } = useContactsStore();

    const { data: phones = [], isFetching: arePhonesFetching } = useQuery(
        PHONES_QUERY_KEYS.LIST(uuid),
        getPhonesList(uuid),
        {
            select: queryData => queryData.data.data,
        }
    );

    const { data: phoneTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.PHONE_TYPES, getPhoneTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const columns: CustomColumn<PhoneContact>[] = useMemo(
        () => [
            {
                id: "type_id",
                accessorKey: "type_id",
                header: "Phone type",
                maxWidth: 200,
                cell: ({ row }) => getLookupItem(phoneTypesLookup, row.original.type_id)?.label,
            },
            {
                id: "is_primary",
                accessorKey: "is_primary",
                header: "Main",
                maxWidth: 120,
                cell: ({ row }) => (
                    <PrimaryCell
                        userUUID={uuid}
                        uuid={row.original.uuid}
                        isPrimary={row.original.is_primary}
                        isVerified={Boolean(row.original.verified_at)}
                        type={type}
                    />
                ),
            },
            {
                id: "number",
                accessorKey: "number",
                header: "Phone number",
                cell: ({ row }) => <PhoneCell number={row.original.number} />,
            },
            // TODO: uncomment and use after BE implementation of verification flow
            // {
            //     id: "verified_at",
            //     accessorKey: "verified_at",
            //     header: "Verified",
            //     maxWidth: 200,
            //     cell: ({ row }) => (
            //         <VerificationCell
            //             isVerified={Boolean(row.original.verified_at)}
            //             uuid={row.original.uuid}
            //             userUUID={uuid}
            //             type={type}
            //             value={row.original.number}
            //         />
            //     ),
            // },
            {
                id: "actions",
                maxWidth: 80,
                cell: ({ row }) => <ActionsCell contact={row.original} type={type} />,
            },
        ],
        [type, uuid, phoneTypesLookup]
    );

    const onCreateClick = () => {
        setupActionType(ContactActionsEnum.ADD_PHONE);
    };

    if (arePhonesFetching) return <ContactsItemSkeleton text="Phones" />;

    return (
        <div className="p-6 bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg overflow-hidden">
            <div className="max-h-full h-full overflow-hidden flex-grow grid grid-rows-autoFr">
                <p className="font-bold text-md pl-3" data-testid="phones-label">
                    Phones
                </p>
                <div className="flex flex-col w-full h-full overflow-hidden pt-6">
                    {!Boolean(phones.length) && (
                        <ContactsPlaceholder type={CONTACT_TYPES.PHONE} onCreateContact={onCreateClick} />
                    )}
                    {Boolean(phones.length) && (
                        <>
                            <Table<PhoneContact> tableName="phones" data={phones} columns={columns} />
                            {phones.length < MAX_PHONE_NUMBER && (
                                <div className="mt-5">
                                    <TextButton
                                        text="Add phone number"
                                        size="thin"
                                        variant="transparent"
                                        type="button"
                                        className="text-brand-100 font-medium"
                                        startIcon={<PlusIcon className="w-6 h-6" />}
                                        onClick={onCreateClick}
                                        data-testid="add-phone-button"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(PhonesCard);
