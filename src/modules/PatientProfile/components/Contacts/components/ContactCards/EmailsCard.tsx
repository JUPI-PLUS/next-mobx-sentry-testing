// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../store";

// api
import { getEmailTypes } from "../../../../../../api/dictionaries";
import { getEmailsList } from "../../../../../../api/emails";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";

// models
import { ContactActionsEnum, ContactCardProps } from "../../models";
import { CustomColumn } from "../../../../../../components/Table/models";
import { EmailContact } from "../../../../../../shared/models/emails";

// constants
import { DICTIONARIES_QUERY_KEYS, EMAILS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { CONTACT_TYPES, MAX_EMAIL_NUMBER } from "../../constants";

// components
import Table from "../../../Table";
import ActionsCell from "./components/ActionsCell/ActionsCell";
// import VerificationCell from "./components/VerificationCell/VerificationCell";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import ContactsPlaceholder from "./components/EmptyContacts/ContactsPlaceholder";
import PrimaryCell from "./components/PrimaryCell/PrimaryCell";
import { ContactsItemSkeleton } from "../Skeletons";

const EmailsCard = ({ uuid }: ContactCardProps) => {
    const type = CONTACT_TYPES.EMAIL;
    const {
        contactsStore: { setupActionType },
    } = useContactsStore();

    const { data: emails = [], isFetching: areEmailsFetching } = useQuery(
        EMAILS_QUERY_KEYS.LIST(uuid),
        getEmailsList(uuid),
        {
            select: queryData => queryData.data.data,
        }
    );

    const { data: emailTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.EMAIL_TYPES, getEmailTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const columns: CustomColumn<EmailContact>[] = useMemo(
        () => [
            {
                id: "type_id",
                accessorKey: "type_id",
                header: "Email type",
                maxWidth: 200,
                cell: ({ row }) => getLookupItem(emailTypesLookup, row.original.type_id)?.label,
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
                id: "email",
                accessorKey: "email",
                header: "Email",
            },
            // TODO: uncomment and use after BE implementation of verification flow
            // {
            //     id: "is_verified",
            //     accessorKey: "is_verified",
            //     header: "Verified",
            //     maxWidth: 200,
            //     cell: ({ row }) => (
            //         <VerificationCell
            //             isVerified={Boolean(row.original.verified_at)}
            //             uuid={row.original.uuid}
            //             userUUID={uuid}
            //             type={type}
            //             value={row.original.email}
            //         />
            //     ),
            // },
            {
                id: "actions",
                maxWidth: 80,
                cell: ({ row }) => <ActionsCell contact={row.original} type={type} />,
            },
        ],
        [type, uuid, emailTypesLookup]
    );

    const onCreateClick = () => {
        setupActionType(ContactActionsEnum.ADD_EMAIL);
    };

    if (areEmailsFetching) return <ContactsItemSkeleton text="Emails" />;

    return (
        <div className="p-6 bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg overflow-hidden">
            <div className="max-h-full h-full overflow-hidden flex-grow grid grid-rows-autoFr">
                <p className="font-bold text-md pl-3" data-testid="emails-label">
                    Emails
                </p>
                <div className="flex flex-col w-full h-full overflow-hidden pt-6">
                    {!Boolean(emails.length) && (
                        <ContactsPlaceholder type={CONTACT_TYPES.EMAIL} onCreateContact={onCreateClick} />
                    )}
                    {Boolean(emails.length) && (
                        <>
                            <Table<EmailContact> tableName="emails" data={emails} columns={columns} />
                            {emails.length < MAX_EMAIL_NUMBER && (
                                <div className="mt-5">
                                    <TextButton
                                        text="Add email"
                                        size="thin"
                                        variant="transparent"
                                        type="button"
                                        className="text-brand-100 font-medium"
                                        startIcon={<PlusIcon className="w-6 h-6" />}
                                        onClick={onCreateClick}
                                        data-testid="add-email-button"
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

export default observer(EmailsCard);
