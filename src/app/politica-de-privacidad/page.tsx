import type { Metadata } from "next";
import LegalPage, { Pending } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
    title: "Política de privacidad | Sayni",
    description: "Cómo trata Sayni Café tus datos personales.",
};

export default function PrivacyPage() {
    return (
        <LegalPage title="Política de privacidad">
            <p>
                Esta política explica cómo tratamos tus datos personales, conforme a la Ley N° 29733, Ley de Protección de Datos Personales, y su reglamento.
            </p>

            <h2>1. Responsable del tratamiento</h2>
            <p>
                {BUSINESS.legalName}, con RUC {BUSINESS.ruc} y domicilio en {BUSINESS.address}. Contacto: {BUSINESS.contactEmail}.
            </p>

            <h2>2. Datos que recopilamos</h2>
            <ul>
                <li><strong>Al comprar:</strong> nombre, correo, teléfono, dirección de entrega y referencia.</li>
                <li><strong>En el Libro de Reclamaciones:</strong> además, tipo y número de documento de identidad y domicilio.</li>
                <li><strong>Al navegar:</strong> el contenido de tu carrito se guarda en tu propio navegador para que no lo pierdas.</li>
            </ul>
            <p>No recopilamos ni almacenamos los datos de tu tarjeta: los pagos los procesa directamente Mercado Pago.</p>

            <h2>3. Para qué usamos tus datos</h2>
            <ul>
                <li>Procesar y entregar tus pedidos, y enviarte su confirmación.</li>
                <li>Contactarte para coordinar la entrega o resolver incidencias.</li>
                <li>Atender tus reclamos, quejas y consultas.</li>
                <li>Cumplir obligaciones legales, tributarias y contables.</li>
            </ul>

            <h2>4. Con quién compartimos tus datos</h2>
            <p>
                Solo con los proveedores necesarios para prestar el servicio, que actúan por nuestra cuenta: la plataforma de pagos (Mercado Pago), el servicio de envío de correos, el proveedor de alojamiento web y base de datos, y el servicio de reparto. No vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>

            <h2>5. Conservación</h2>
            <p>
                Conservamos tus datos durante el tiempo necesario para cumplir las finalidades indicadas y las obligaciones legales aplicables.
            </p>

            <h2>6. Tus derechos</h2>
            <p>
                Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (derechos ARCO) escribiendo a {BUSINESS.contactEmail}. Si consideras que no fueron atendidos, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.
            </p>

            <h2>7. Seguridad</h2>
            <p>
                Aplicamos medidas técnicas y organizativas para proteger tus datos, como conexiones cifradas (HTTPS) y acceso restringido a la información.
            </p>

            <h2>8. Banco de datos</h2>
            <p>
                <Pending>Los datos se almacenan en el banco de datos de clientes de {BUSINESS.legalName}, inscrito ante la Autoridad Nacional de Protección de Datos Personales.</Pending>
            </p>

            <h2>9. Cambios en esta política</h2>
            <p>Podemos actualizar esta política. La versión vigente es la publicada en esta página.</p>
        </LegalPage>
    );
}