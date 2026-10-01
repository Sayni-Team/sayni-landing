"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    grind?: string;
    weight?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    totalCartCount: number;
    totalPrice: number;
    isInitialized: boolean;
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LOCAL_STORAGE_KEY = "sayni_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Error cargando carrito de localStorage", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
            } catch (error) {
                console.error("Error guardando carrito en localStorage", error);
            }
        }
    }, [cartItems, isInitialized]);

    const addToCart = (newItem: CartItem) => {
        const itemQty = newItem.quantity && !isNaN(newItem.quantity) ? newItem.quantity : 1;
        setCartItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === newItem.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + itemQty,
                };
                return updated;
            }
            return [...prev, { ...newItem, quantity: itemQty }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string | number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string | number, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null)
        );
    };

    const clearCart = () => setCartItems([]);

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalCartCount,
                totalPrice,
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