import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Pending } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
    title: "Términos y condiciones | Sayni",
    description: "Condiciones de compra en la tienda online de Sayni Café.",
};

export default function TermsPage() {
    return (
        <LegalPage title="Términos y condiciones">
            <p>
                Estos términos regulan las compras realizadas en {BUSINESS.website}. Al realizar un pedido, aceptas estas condiciones.
            </p>

            <h2>1. Información de la empresa</h2>
            <ul>
                <li><strong>Razón social:</strong> {BUSINESS.legalName}</li>
                <li><strong>RUC:</strong> {BUSINESS.ruc}</li>
                <li><strong>Domicilio:</strong> {BUSINESS.address}</li>
                <li><strong>Contacto:</strong> {BUSINESS.contactEmail} · WhatsApp {BUSINESS.whatsapp}</li>
            </ul>

            <h2>2. Productos y precios</h2>
            <p>
                Los precios se muestran en soles (S/) e incluyen el IGV. El precio aplicable es el vigente al momento de confirmar el pedido. Los precios y promociones pueden cambiar sin previo aviso, sin afectar a los pedidos ya pagados.
            </p>
            <p>
                Las promociones se aplican según las condiciones indicadas en la tienda. Todos los productos están sujetos a disponibilidad de stock.
            </p>

            <h2>3. Proceso de compra</h2>
            <p>
                Para comprar, añade los productos al carrito, completa tus datos de contacto y entrega, y realiza el pago a través de Mercado Pago. El pedido queda confirmado cuando el pago es aprobado; en ese momento recibirás un correo de confirmación con tu número de pedido.
            </p>
            <p>
                Para envíos fuera de Lima, el pedido se coordina por WhatsApp, donde se cotiza el costo de envío antes del pago.
            </p>

            <h2>4. Medios de pago</h2>
            <p>
                Los pagos se procesan a través de Mercado Pago, que acepta tarjetas y otros medios disponibles en su plataforma. {BUSINESS.tradeName} no almacena ni tiene acceso a los datos de tu tarjeta.
            </p>

            <h2>5. Comprobantes de pago</h2>
            <p>
                Emitimos el comprobante de pago correspondiente a cada compra <Pending>(boleta o factura electrónica, según lo indique el cliente al comprar)</Pending>.
            </p>

            <h2>6. Envíos, cambios y devoluciones</h2>
            <p>
                Las condiciones de entrega se detallan en nuestra <Link href="/politica-de-envios">Política de envíos</Link>, y las de cambios y devoluciones en <Link href="/cambios-y-devoluciones">Cambios y devoluciones</Link>.
            </p>

            <h2>7. Datos personales</h2>
            <p>
                El tratamiento de tus datos se rige por nuestra <Link href="/politica-de-privacidad">Política de privacidad</Link>.
            </p>

            <h2>8. Reclamos y quejas</h2>
            <p>
                Puedes registrar un reclamo o queja en nuestro <Link href="/libro-de-reclamaciones">Libro de Reclamaciones</Link> virtual, conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571).
            </p>

            <h2>9. Cambios en estos términos</h2>
            <p>
                Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página al momento de tu compra.
            </p>

            <h2>10. Legislación aplicable</h2>
            <p>Estos términos se rigen por las leyes de la República del Perú.</p>
        </LegalPage>
    );
}