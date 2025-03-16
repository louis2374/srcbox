"use client"
import { join } from '@/lib/css'
import React, { useEffect, useState } from 'react'

const MiniProfileBox = () =>
{
    const [selected, set_selected] = useState(false);

    return (
        <>
            <div
                className='flex flex-row p-1 align-middle justify-center relative z-20'
            >
                <div className={join('flex hover:bg-neutral-800 rounded-lg cursor-pointer m-2', selected && "bg-neutral-800")}>
                    <img
                        className='rounded-[50%] m-1' src='pfp.webp'
                        onClick={() => set_selected(!selected)}
                    />
                </div>
                <div className={join('z-30 shadow-lg m-3 absolute right-0 top-full bg-neutral-800 w-56 h-48 rounded-md', !selected && "hidden")}>Hi</div>
            </div>
            <div
                className={join('bg-none fixed left-0 right-0 top-0', selected && "bottom-0")}
                onClick={() => set_selected(!selected)}
            />
        </>
    )
}

export default MiniProfileBox;