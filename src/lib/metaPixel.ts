// Eventos estándar del Píxel de Meta (para que la pauta optimice por carrito y compras).
// Seguro en cualquier momento: si el script todavía no cargó, reintenta unos segundos.
declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type MetaParams = Record<string, unknown>;

/** eventID: identificador único del evento (ej. id del pedido), útil para no duplicar con la API de Conversiones */
export function metaEvent(name: string, params?: MetaParams, eventID?: string) {
    if (typeof window === "undefined" || !META_PIXEL_ID) return;

    let tries = 0;
    const send = () => {
        if (window.fbq) {
            window.fbq("track", name, params ?? {}, eventID ? { eventID } : undefined);
        } else if (tries++ < 20) {
            setTimeout(send, 250); // hasta 5 s esperando al script
        }
    };
    send();
}

/** céntimos → soles, como lo espera Meta */
export const toSoles = (cents: number) => Math.round(cents) / 100;

/** Evento personalizado (no estándar de Meta): se envía con trackCustom */
export function metaCustomEvent(name: string, params?: MetaParams) {
    if (typeof window === "undefined" || !META_PIXEL_ID) return;

    let tries = 0;
    const send = () => {
        if (window.fbq) {
            window.fbq("trackCustom", name, params ?? {});
        } else if (tries++ < 20) {
            setTimeout(send, 250); // hasta 5 s esperando al script
        }
    };
    send();
}
