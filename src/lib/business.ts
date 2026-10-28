// Datos del proveedor que exige el Libro de Reclamaciones.
// PLACEHOLDER: reemplazar con los datos reales del cliente antes de publicar.
export const BUSINESS = {
    tradeName: "Sayni Café",
    legalName: "RAZÓN SOCIAL S.A.C.", // PLACEHOLDER
    ruc: "20XXXXXXXXX", // PLACEHOLDER
    address: "DIRECCIÓN FISCAL, DISTRITO, LIMA", // PLACEHOLDER
    website: "www.sayniperu.com",
    contactEmail: "Jhonnatan.murga@sayniperu.com", // PLACEHOLDER: correo de atención al cliente
    whatsapp: "+51 939 273 366",
};

// Plazo de respuesta a reclamos y quejas (días hábiles). Confirmar con la norma vigente.
export const COMPLAINT_RESPONSE_DAYS = 15;

export const LEGAL_UPDATED = "28 de octubre de 2026";

/** 7 → "000007" */
export const complaintCode = (n: number) => String(n).padStart(6, "0");