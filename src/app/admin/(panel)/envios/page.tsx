import { prisma } from "@/lib/prisma";
import ZoneRow from "./ZoneRow";
import NewZoneForm from "./NewZoneForm";

export default async function ShippingPage() {
    const zones = await prisma.shippingZone.findMany({ orderBy: { sortOrder: "asc" } });

    return (
        <div className="max-w-3xl">
            <h1 className="font-heading text-2xl font-bold">Envíos</h1>
            <p className="mt-2 text-sm text-white/60">
                Tarifas de delivery en Lima. Un distrito desactivado deja de aparecer en el checkout. Provincia se cotiza por WhatsApp.
            </p>

            <div className="mt-6">
                <NewZoneForm />
            </div>

            <div className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/10 bg-[#132219]">
                {zones.map((z) => (
                    <ZoneRow key={z.id} zone={{ id: z.id, district: z.district, price: z.price, active: z.active }} />
                ))}
            </div>
        </div>
    );
}