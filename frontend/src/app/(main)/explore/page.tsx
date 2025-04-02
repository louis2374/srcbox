"use client"
import { api, useToken } from "@/lib/api/api";
import { D_Post, Method } from "@srcbox/library";
import { useEffect, useRef, useState } from "react";
import PostCard from "../../../components/PostCard/PostCard";
import SinglePostScroller from "@/components/SingleDisplayPostScroller/SinglePostScroller";

const page = () =>
{

    return (
        <div className="w-full max-w-3xl">
            <SinglePostScroller />
        </div>
    );
}

export default page;