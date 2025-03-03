"use client";

import { shared, shared_v2 } from '@srcbox/library';
import React, { useState } from 'react'

const Example = () =>
{
    const [text, set_text] = useState("Click For Resposne");
    const [loading, set_loading] = useState(false);

    const get_text = async () =>
    {
        const url = process.env.NEXT_PUBLIC_API_BASE_HOST;
        set_loading(true);
        const response = await fetch(url!);
        const new_text = await response.text();
        set_loading(false);

        set_text(new_text);
    }

    return (
        <button
            className='p-4 bg-orange-500 flex w-full'
            onClick={get_text}>
            {text}
        </button>
    )
}

export default Example;
