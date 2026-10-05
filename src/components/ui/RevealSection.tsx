"use client";

import type { ComponentProps } from "react";
import { useInView} from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/** <section> que marca data-inview al entrar al viewport; los hijos animan con REVEAL.* */
export default function RevealSection({ className, children, ...rest }: ComponentProps<"section">) {
    const { ref, inView } = useInView<HTMLElement>();

    return (
        <section
            {...rest}
            ref={ref}
            data-inview={inView}
            className={cn("group/reveal", className)}
        >
            {children}
        </section>
    );
}