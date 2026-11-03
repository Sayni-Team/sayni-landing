"use client";

import { useEffect } from "react";
import { clarityEvent } from "@/lib/clarity";

// Marca la sesión como compra completada (una vez por pedido, aunque recargue la página)
export default function TrackPurchase({ orderId }: { orderId: string }) {
    useEffect(() => {
        const key = `clarity-purchase-${orderId}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
        clarityEvent("purchase");
    }, [orderId]);

    return null;
}