"use client";

import { shared } from '@srcbox/library';
import React, { useState } from 'react'

const Example = () =>
{
    const [text, set_text] = useState("Click For Resposne");

    const get_text = async () =>
    {
        const response = await fetch("http://localhost:4000");
        const new_text = await response.text();

        set_text(new_text);//
        console.log("OK")
    }

    return (
        <div>
            <button onClick={get_text}>
                {text} {shared()}
            </button>

        </div>
    )
}

export default Example;
