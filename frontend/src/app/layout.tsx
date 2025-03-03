import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
        <html>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    )
}

export default layout
