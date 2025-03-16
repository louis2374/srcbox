import type { Metadata } from "next";
import "../globals.css";
import { ReactNode } from "react";
import { auth_soft_is_logged_in } from "@/lib/auth";
import { redirect } from "next/dist/server/api-utils";
import { permanentRedirect } from "next/navigation";
export const metadata: Metadata = {
    title: "Base Title",
    description: "Bade Description",
};

interface Props
{
    children: ReactNode
}

const layout: React.FC<Readonly<Props>> = async ({ children }) =>
{
    // If the user is already logged in, push them to home
    const soft_logged = await auth_soft_is_logged_in();
    if (soft_logged) permanentRedirect("/")

    return (
        <>
            <section className="flex justify-center align-middle flex-1 bg-black">
                {children}
            </section>
        </>
    )
}

export default layout;
