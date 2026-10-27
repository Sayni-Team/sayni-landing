"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { priceForQuantity } from "@/lib/pricing";
import type { StoreProduct } from "@/lib/products";

// Una línea del carrito: solo qué y cuánto. El precio sale siempre del catálogo.
type CartLine = {
    id: string; // "geisha-250-grano" o "pack-regalo-clasico"
    productId: string;
    variant?: string; // "grano" | "molido"
    quantity: number;
};

// Línea lista para mostrar (con nombre, imagen y precio del catálogo)
export type CartItemView = CartLine & {
    title: string;
    image: string;
    unitPrice: number; // céntimos
};

type AddToCartInput = {
    productId: string;
    variant?: string;
    quantity?: number;
};

interface CartContextType {
    items: CartItemView[];
    addToCart: (input: AddToCartInput) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    getProduct: (productId: string) => StoreProduct | undefined;
    remainingStock: (productId: string) => number;
    totalCartCount: number;
    subtotal: number; // precio normal, sin promociones (céntimos)
    discount: number; // ahorro por promociones (céntimos)
    total: number; // a pagar por los productos (céntimos)
    isInitialized: boolean;
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// v2: el formato cambió (antes guardaba precios). Los carritos antiguos se descartan.
const LOCAL_STORAGE_KEY = "sayni_cart_v2";

const VARIANT_LABEL: Record<string, string> = { grano: "Grano", molido: "Molido" };

const lineId = (productId: string, variant?: string) => (variant ? `${productId}-${variant}` : productId);

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ catalog, children }: { catalog: StoreProduct[]; children: React.ReactNode }) => {
    const [lines, setLines] = useState<CartLine[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const productsById = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

    const getProduct = useCallback((productId: string) => productsById.get(productId), [productsById]);

    // Cargar el carrito guardado, descartando productos que ya no se venden
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                const parsed: CartLine[] = JSON.parse(stored);
                setLines(parsed.filter((l) => productsById.get(l.productId)?.status === "ACTIVE" && l.quantity > 0));
            }
            localStorage.removeItem("sayni_cart"); // formato antiguo
        } catch (error) {
            console.error("Error cargando carrito de localStorage", error);
        } finally {
            setIsInitialized(true);
        }
    }, [productsById]);

    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lines));
        } catch (error) {
            console.error("Error guardando carrito en localStorage", error);
        }
    }, [lines, isInitialized]);

    // Unidades de un producto en el carrito, sumando todas sus presentaciones
    const quantityInCart = useCallback(
        (productId: string, from: CartLine[] = lines) =>
            from.filter((l) => l.productId === productId).reduce((acc, l) => acc + l.quantity, 0),
        [lines]
    );

    const remainingStock = useCallback(
        (productId: string) => {
            const product = productsById.get(productId);
            if (!product || product.status !== "ACTIVE") return 0;
            return Math.max(0, product.stock - quantityInCart(productId));
        },
        [productsById, quantityInCart]
    );

    const addToCart = ({ productId, variant, quantity = 1 }: AddToCartInput) => {
        const product = productsById.get(productId);
        if (!product || product.status !== "ACTIVE") return;

        setLines((prev) => {
            // No superar el stock (todas las presentaciones comparten stock)
            const available = product.stock - quantityInCart(productId, prev);
            const toAdd = Math.min(quantity, available);
            if (toAdd <= 0) return prev;

            const id = lineId(productId, variant);
            const existing = prev.find((l) => l.id === id);
            if (existing) {
                return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + toAdd } : l));
            }
            return [...prev, { id, productId, variant, quantity: toAdd }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setLines((prev) => prev.filter((l) => l.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setLines((prev) =>
            prev
                .map((l) => {
                    if (l.id !== id) return l;
                    if (delta > 0) {
                        const product = productsById.get(l.productId);
                        const available = (product?.stock ?? 0) - quantityInCart(l.productId, prev);
                        if (available <= 0) return l; // sin stock: no sube
                    }
                    const quantity = l.quantity + delta;
                    return quantity > 0 ? { ...l, quantity } : null;
                })
                .filter((l): l is CartLine => l !== null)
        );
    };

    const clearCart = () => setLines([]);

    // Líneas con datos del catálogo
    const items = useMemo<CartItemView[]>(
        () =>
            lines.flatMap((l) => {
                const product = productsById.get(l.productId);
                if (!product) return [];
                return [
                    {
                        ...l,
                        title: l.variant ? `${product.name} (${VARIANT_LABEL[l.variant] ?? l.variant})` : product.name,
                        image: product.image,
                        unitPrice: product.price,
                    },
                ];
            }),
        [lines, productsById]
    );

    // Totales: la promoción se aplica por producto, sumando sus presentaciones
    const { subtotal, total } = useMemo(() => {
        const qtyByProduct = new Map<string, number>();
        for (const l of lines) qtyByProduct.set(l.productId, (qtyByProduct.get(l.productId) ?? 0) + l.quantity);

        let regular = 0;
        let withPromos = 0;
        for (const [productId, qty] of qtyByProduct) {
            const product = productsById.get(productId);
            if (!product) continue;
            regular += product.price * qty;
            withPromos += priceForQuantity(qty, product.price, product.tiers);
        }
        return { subtotal: regular, total: withPromos };
    }, [lines, productsById]);

    const totalCartCount = lines.reduce((acc, l) => acc + l.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getProduct,
                remainingStock,
                totalCartCount,
                subtotal,
                discount: subtotal - total,
                total,
                isInitialized,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};