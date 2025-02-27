"use client";

import { shared, shared_v2 } from '@srcbox/library';
import React, { useState } from 'react'

const Example = () =>
{
    const [text, set_text] = useState("Click For Resposne");

    const get_text = async () =>
    {
        const url = process.env.NEXT_PUBLIC_API_BASE_HOST;
        const response = await fetch(url!);
        const new_text = await response.text();

        set_text(new_text);
        console.log("OK")
    }

    return (
        <div>
            <button onClick={get_text}>
                {text} {shared_v2()}
            </button>

        </div>
    )
}

export default Example;
