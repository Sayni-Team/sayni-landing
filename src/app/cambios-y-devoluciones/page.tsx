import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Pending } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
    title: "Cambios y devoluciones | Sayni",
    description: "Condiciones para cambios y devoluciones en Sayni Café.",
};

export default function ReturnsPage() {
    return (
        <LegalPage title="Cambios y devoluciones">
            <p>
                Queremos que disfrutes tu café. Si hay algún problema con tu pedido, estamos para ayudarte.
            </p>

            <h2>1. Productos alimenticios</h2>
            <p>
                Por tratarse de productos de consumo, y por razones de higiene e inocuidad, no aceptamos cambios ni devoluciones de productos abiertos o en buen estado por motivos de preferencia personal.
            </p>

            <h2>2. Casos en los que procede un cambio o devolución</h2>
            <ul>
                <li>El producto llegó dañado o con el empaque abierto.</li>
                <li>Recibiste un producto distinto al que compraste (por ejemplo, molido en lugar de grano).</li>
                <li>El pedido llegó incompleto.</li>
                <li>El producto presenta un defecto de calidad.</li>
            </ul>

            <h2>3. Plazo y cómo solicitarlo</h2>
            <p>
                Escríbenos dentro de los <Pending>7 días calendario</Pending> siguientes a la entrega, a {BUSINESS.contactEmail} o por WhatsApp al {BUSINESS.whatsapp}, indicando tu número de pedido, una descripción del problema y fotos del producto y su empaque.
            </p>

            <h2>4. Solución</h2>
            <p>
                Tras revisar tu caso, te ofreceremos la reposición del producto o el reembolso del importe correspondiente. Los reembolsos se realizan por el mismo medio de pago, a través de Mercado Pago; el plazo en que se reflejan depende de tu banco o entidad emisora.
            </p>

            <h2>5. Accesorios</h2>
            <p>
                La prensa francesa incluida en los packs puede cambiarse por defectos de fabricación reportados dentro de los <Pending>30 días calendario</Pending> siguientes a la entrega. No se cubren daños por mal uso.
            </p>

            <h2>6. Tus derechos</h2>
            <p>
                Esta política no limita los derechos que te reconoce el Código de Protección y Defensa del Consumidor (Ley N° 29571). También puedes registrar un reclamo en nuestro <Link href="/libro-de-reclamaciones">Libro de Reclamaciones</Link>.
            </p>
        </LegalPage>
    );
}