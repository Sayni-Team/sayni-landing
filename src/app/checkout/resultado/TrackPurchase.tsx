"use client";

import { useEffect } from "react";
import { clarityEvent } from "@/lib/clarity";
import { metaEvent, toSoles } from "@/lib/metaPixel";

// Marca la sesión como compra completada (una vez por pedido, aunque recargue la página)
export default function TrackPurchase({ orderId, total }: { orderId: string; total: number }) {
    useEffect(() => {
        const key = `clarity-purchase-${orderId}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
        clarityEvent("purchase");
        // total del pedido en céntimos (productos + envío); eventID = pedido, para no duplicar
        metaEvent("Purchase", { value: toSoles(total), currency: "PEN" }, orderId);
    }, [orderId, total]);

    return null;
}