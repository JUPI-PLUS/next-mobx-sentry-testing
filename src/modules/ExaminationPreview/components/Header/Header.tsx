// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";

// api
import { getOrdersConditionsBySample } from "../../../../api/samples";

// helpers
import { addOffsetToUtcDate } from "../../../../shared/utils/date";
import { getPreviewOrdersConditions } from "../../helpers";

// models
import { HeaderProps } from "./models";

// constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { SAMPLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

const Header = ({ sampleUUID }: HeaderProps) => {
    const { data: ordersConditions } = useQuery(
        SAMPLES_QUERY_KEYS.ORDERS_CONDITIONS(sampleUUID),
        getOrdersConditionsBySample(sampleUUID),
        {
            select: queryData => queryData.data.data,
        }
    );

    const previewOrdersConditions = useMemo(() => getPreviewOrdersConditions(ordersConditions), [ordersConditions]);

    return (
        <div className="px-3">
            <div className="flex justify-between w-full mb-6">
                <div className="w-1/2">
                    <img
                        src="https://imagedelivery.net/vO8gq8K28jAqmnRdcjnTkg/20341bcb-f585-48ad-a32f-fa538fddc700/public"
                        alt="enverlims logo"
                    />
                </div>
                <div className="flex items-center justify-between w-1/2">
                    <div>Auftragsnummer:</div>
                    <div className="text-lg font-bold">UNKNOWN</div>
                </div>
            </div>
            <div className="flex justify-between w-full mb-6">
                <div className="w-1/2">
                    <div>
                        Laborarztpraxis Dr. Haupts in Kooperation mit <br />
                        enverque Labor Potsdam
                    </div>
                    <div>Am Mühlenberg 10 14476 Potsdam</div>
                    <div>Telefon: +49 (0)30 5658 4873</div>
                    <div>E-Mail: info@enverque.de</div>
                </div>
                <div className="flex flex-col w-1/2">
                    <div className="flex justify-between">
                        <div>Einsender</div>
                        <div className="font-bold">UNKNOWN</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Validiert durch</div>
                        <div className="font-bold">UNKNOWN</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Teilbefund/Endbefund vom</div>
                        <div className="font-bold">
                            {format(addOffsetToUtcDate(Date.now()), DATE_FORMATS.DATE_TIME_ONLY_DOTS)}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>Probeneingang vom</div>
                        <div className="font-bold">
                            {format(addOffsetToUtcDate(Date.now()), DATE_FORMATS.DATE_ONLY_DOTS)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full mb-8">
                <div className="w-1/2">
                    <div className="flex">
                        <div>
                            <div className="flex gap-2">
                                <div>Name, Vorname</div>
                                <div className="font-bold">UNKNOWN</div>
                            </div>
                            <div className="flex gap-2">
                                <div>Geburtsdatum</div>
                                <div className="font-bold">UNKNOWN</div>
                            </div>
                            <div className="flex gap-2">
                                <div>Geschlecht</div>
                                <div className="font-bold">UNKNOWN</div>
                            </div>
                            <div className="flex gap-2">
                                <div>Email</div>
                                <div className="font-bold">UNKNOWN</div>
                            </div>
                            {previewOrdersConditions.map(({ id, name, value }) => (
                                <div key={id} className="flex gap-2">
                                    <div>{name}</div>
                                    <div className="font-bold">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
