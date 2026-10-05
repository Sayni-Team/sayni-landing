"use client";

import { useEffect, useRef, useState } from "react";

/** true la primera vez que el elemento entra al viewport; luego deja de observar. */

export function useInView<T extends Element>() {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(

            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
        );



        observer.observe(el);
        return () => observer.disconnect();
    }, []);


    return { ref, inView };
}

