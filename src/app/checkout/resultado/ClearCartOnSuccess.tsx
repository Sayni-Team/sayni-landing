"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnSuccess() {
    const { clearCart, isInitialized } = useCart();

    useEffect(() => {
        if (isInitialized) clearCart();
    }, [isInitialized, clearCart]);

    return null;
}