import type { GetServerSideProps, Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Context, ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import { RequestContext } from "next/dist/server/base-server";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/dist/server/api-utils";
import { check_auth_redirect } from "@/lib/auth";

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
    await check_auth_redirect()
    return (
        <>
            Auth
            {children}
        </>
    )
}

export default layout
