import type { GetServerSideProps, Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import { auth_soft_is_logged_in } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Base Title",
    description: "Bade Description",
};

interface Props
{
    children: ReactNode,
    url: string
}

const layout: React.FC<Readonly<Props>> = async ({ children }) =>
{
    // If the user not already logged in, push them to login
    const soft_logged = await auth_soft_is_logged_in();
    if (!soft_logged) permanentRedirect("/login")

    return (
        <>
            <section className="flex justify-center align-middle flex-1 bg-background">
                <Navbar />
                {children}
            </section>
        </>
    )
}

export default layout
