import type { Metadata } from "next";
import LegalPage, { Pending } from "@/components/legal/LegalPage";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
    title: "Política de envíos | Sayni",
    description: "Zonas de entrega, tarifas y plazos de envío de Sayni Café.",
};

// Las tarifas salen de la base de datos (las mismas del checkout)
export const revalidate = 60;

export default async function ShippingPolicyPage() {
    const zones = await prisma.shippingZone.findMany({
        where: { active: true },
        orderBy: [{ price: "asc" }, { district: "asc" }],
        select: { district: true, price: true },
    });

    // Distritos agrupados por tarifa
    const byPrice = new Map<number, string[]>();
    for (const z of zones) byPrice.set(z.price, [...(byPrice.get(z.price) ?? []), z.district]);

    return (
        <LegalPage title="Política de envíos">
            <h2>1. Cobertura</h2>
            <p>
                Realizamos entregas a domicilio en Lima Metropolitana y Callao, en los distritos indicados abajo. A provincia enviamos a todo el Perú por Shalom: el cliente elige la agencia Shalom de destino donde recogerá su pedido (ver punto 4).
            </p>

            <h2>2. Tarifas (IGV incluido)</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
                {[...byPrice.entries()].map(([price, districts]) => (
                    <div key={price} className="grid gap-2 border-b border-white/5 p-4 last:border-0 sm:grid-cols-[100px_1fr]">
                        <span className="font-bold text-[#BCC90F]">{formatPEN(price)}</span>
                        <span className="text-sm text-white/70">{districts.join(" · ")}</span>
                    </div>
                ))}
            </div>
            <p className="text-sm text-white/50">El costo de envío se muestra en el checkout antes de pagar, según el distrito elegido.</p>

            <h2>3. Plazos de entrega</h2>
            <p>
                Los pedidos se entregan en un plazo máximo de <strong>3 días hábiles</strong> desde la confirmación del pago, en el horario de <Pending>lunes a sábado, de 9:00 a 18:00</Pending>. Los plazos pueden extenderse en fechas de alta demanda o por causas ajenas a nuestro control.
            </p>

            <h2>4. Envíos a provincia (Shalom)</h2>
            <p>
                Llevamos el pedido a una agencia Shalom de Lima <strong>sin costo para el cliente</strong>, dentro de las <strong>24 a 48 horas hábiles</strong> siguientes a la confirmación del pago. El <strong>flete de Shalom</strong> hasta la ciudad de destino <strong>no está incluido</strong> en el precio y lo paga el cliente al recoger en la agencia elegida. El tiempo de traslado depende de Shalom. Para recoger, Shalom solicita el DNI de la persona indicada en el pedido. Si tienes dudas, escríbenos por WhatsApp ({BUSINESS.whatsapp}).
            </p>

            <h2>5. Coordinación de la entrega</h2>
            <p>
                Tras la confirmación del pago, podremos contactarte por teléfono o WhatsApp para coordinar la entrega. Es importante que la dirección, la referencia y el teléfono sean correctos.
            </p>

            <h2>6. Entregas no realizadas</h2>
            <p>
                Si no hay nadie para recibir el pedido o la dirección es incorrecta, coordinaremos una nueva entrega. <Pending>Una segunda visita podría tener un costo adicional.</Pending>
            </p>

            <h2>7. Recepción del pedido</h2>
            <p>
                Al recibir tu pedido, revisa que esté completo y en buen estado. Si encuentras algún problema, consulta nuestra política de <a href="/cambios-y-devoluciones">Cambios y devoluciones</a>.
            </p>
        </LegalPage>
    );
}