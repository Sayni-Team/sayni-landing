import { EXPORT_FILTERS, limaToday } from "@/lib/order-status";

const INPUT =
    "rounded-lg border border-white/10 bg-[#0d1711] px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-[#BCC90F] focus:outline-none";

export default function ExportForm() {
    const today = limaToday();
    const firstOfMonth = `${today.slice(0, 8)}01`;

    return (
        <form
            method="GET"
            action="/admin/pedidos/exportar"
            className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-[#132219] p-4"
        >
            <label className="block">
                <span className="mb-1 block text-xs text-white/60">Desde</span>
                <input type="date" name="desde" defaultValue={firstOfMonth} max={today} required className={INPUT} />
            </label>

            <label className="block">
                <span className="mb-1 block text-xs text-white/60">Hasta</span>
                <input type="date" name="hasta" defaultValue={today} max={today} required className={INPUT} />
            </label>

            <label className="block">
                <span className="mb-1 block text-xs text-white/60">Incluir</span>
                <select name="estado" defaultValue="ventas" className={INPUT}>
                    {Object.entries(EXPORT_FILTERS).map(([key, f]) => (
                        <option key={key} value={key}>{f.label}</option>
                    ))}
                </select>
            </label>

            <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#BCC90F] px-5 py-2 text-sm font-bold text-[#132219] transition-opacity hover:opacity-90"
            >
                Descargar Excel
            </button>
        </form>
    );
}