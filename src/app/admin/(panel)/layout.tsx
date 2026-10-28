import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { logout } from "../login/actions";

export const metadata: Metadata = {
    title: "Sayni Admin",
    robots: { index: false, follow: false },
};

// El panel siempre se genera en cada petición (nunca se guarda en caché)
export const dynamic = "force-dynamic";

const NAV = [
    { href: "/admin", label: "Pedidos" },
    { href: "/admin/productos", label: "Productos" },
    { href: "/admin/envios", label: "Envíos" },
    { href: "/admin/reclamos", label: "Reclamos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await requireAdminPage();

    return (
        <div className="min-h-screen bg-sayni-black font-urbanist text-white">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-10">
                <nav className="flex items-center gap-6 text-sm">
                    <span className="font-heading text-lg font-bold text-[#BCC90F]">Sayni Admin</span>
                    {NAV.map((item) => (
                        <Link key={item.href} href={item.href} className="text-white/70 transition-colors hover:text-white">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <form action={logout} className="flex items-center gap-4 text-sm">
                    <span className="text-white/50">{admin.email}</span>
                    <button type="submit" className="cursor-pointer text-white/70 underline-offset-4 hover:text-white hover:underline">
                        Cerrar sesión
                    </button>
                </form>
            </header>

            <main className="px-6 py-8 sm:px-10">{children}</main>
        </div>
    );
}