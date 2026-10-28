import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Acceso | Sayni Admin",
    robots: { index: false, follow: false },
};

export default async function LoginPage() {
    // Con sesión activa, directo al panel
    if (await getAdmin()) redirect("/admin");

    return (
        <main className="flex min-h-screen items-center justify-center bg-sayni-black px-6 font-urbanist">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#132219] p-8">
                <span className="relative mx-auto block size-12">
                    <Image src="/assets/brand/logo.webp" alt="Sayni" fill className="object-contain" />
                </span>
                <h1 className="mt-5 text-center font-heading text-2xl font-bold text-white">Panel de administración</h1>
                <LoginForm />
            </div>
        </main>
    );
}