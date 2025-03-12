import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
    title: "Base Title",
    description: "Bade Description",
};

interface Props
{
    children: ReactNode
}

const layout: React.FC<Readonly<Props>> = ({ children }) =>
{
    return (
        <>
            <Navbar />
            <section className="flex justify-center align-middle flex-1">
                {children}
            </section>
        </>
    )
}

export default layout
