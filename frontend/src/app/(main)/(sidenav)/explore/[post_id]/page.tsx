"use client"
import { api, useToken } from "@/lib/api/api";
import { D_Post, Method } from "@srcbox/library";
import { useEffect, useRef, useState } from "react";
import SinglePostScroller from "@/components/SingleDisplayPostScroller/SinglePostScroller";
import { useParams } from "next/navigation";

const page = () =>
{
    const params = useParams();

    return (
        <div className="w-full max-h-screen overflow-hidden">
            <SinglePostScroller top={Number(params.post_id)} />
        </div>
    );
}

export default page;