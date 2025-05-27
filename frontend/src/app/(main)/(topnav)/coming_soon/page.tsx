"use client"
import FormInput from "@/components/FormInput";
import SButton from "@/components/SButton";
import { api, useToken } from "@/lib/api/api";
import { Method } from "@srcbox/library";
import { useState } from "react";

const page = () =>
{
    const [name, set_name] = useState("");
    const [desc, set_desc] = useState("")

    const token = useToken();

    const sub = () =>
    {
        api("/posts", Method.POST, { body: { title: name, description: desc }, token }).then(console.log)
    }

    return (
        <div className="w-52 justify-center align-middle text-center flex-1 flex flex-col">
            <h1 className="text-4xl">Coming Soon!</h1>
        </div>
    );
}

export default page;