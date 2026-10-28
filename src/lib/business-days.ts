/**
 * Suma días hábiles (lunes a viernes, hora de Lima).
 * No descuenta feriados: la fecha resultante es igual o anterior al plazo real (más segura).
 */
export function addBusinessDays(from: Date, days: number): Date {
    const LIMA_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC-5, sin horario de verano
    const date = new Date(from);
    let added = 0;

    while (added < days) {
        date.setUTCDate(date.getUTCDate() + 1);
        const weekday = new Date(date.getTime() - LIMA_OFFSET_MS).getUTCDay();
        if (weekday !== 0 && weekday !== 6) added++;
    }
    return date;
}