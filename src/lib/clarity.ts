// Eventos personalizados de Microsoft Clarity, para filtrar las grabaciones por paso de la compra.
// Seguro en cualquier momento: si el script todavía no cargó, reintenta unos segundos.
declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
    }
}

export function clarityEvent(name: string) {
    if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_CLARITY_ID) return;

    let tries = 0;
    const send = () => {
        if (window.clarity) {
            window.clarity("event", name);
        } else if (tries++ < 20) {
            setTimeout(send, 250); // hasta 5 s esperando al script
        }
    };
    send();
}