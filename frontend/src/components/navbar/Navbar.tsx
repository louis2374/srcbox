"use client"

import Link from 'next/link';
import React from 'react'
import { AiFillHome } from 'react-icons/ai';
import { TbBinocularsFilled } from 'react-icons/tb';
import { FaCode, FaSquarePlus } from 'react-icons/fa6';
import { MdLeaderboard } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { join } from '@/lib/css';
import MiniProfileBox from '../MiniProfileBox/MiniProfileBox';

// Easier to map this array into the buttons, rather than
// build each one individually
const buttons =
    [
        { href: "/", label: "Home", icon: AiFillHome },
        { href: "/explore", label: "Explore", icon: TbBinocularsFilled },
        { href: "/post", label: "Post", icon: FaSquarePlus },
        { href: "/editor", label: "Editor", icon: FaCode },
        { href: "/featured", label: "Featured", icon: MdLeaderboard },
    ];

interface Props
{
    vertical?: boolean
}

const Navbar: React.FC<Props> = ({ vertical }) =>
{
    const pn = usePathname();

    return (
        <nav className={join('grid sticky bg-inherit', vertical ? "flex-col h-screen grid-rows-6 w-44" : "flex-row w-screen h-[80px] grid-cols-6")}>

            <Link
                href={"/"}
                className='p-4 text-3xl text-center flex justify-center items-center'
            >Srcbox</Link>

            <div className={join('flex justify-center items-center', vertical ? "flex-col row-span-4" : "flex-row col-span-4")}>
                {
                    // Nav buttons
                    buttons.map(({ href, label, icon: Icon }) =>
                    {

                        const active = href.length !== 1 ? pn.startsWith(href) : pn === href
                        return <Link
                            key={label}
                            href={href}
                            className={join('text-center w-24 py-3 px-1', active && (!vertical ? "border-b-4 border-b-accent border-b-solid" : "border-r-4 border-r-accent border-r-solid"))}>
                            <Icon
                                className='m-auto'
                                size={35}
                                color={active ? "var(--accent)" : undefined} />
                            <span className={join(active && "text-accent")}>{label}</span>
                        </Link>
                    })
                }
            </div>

            <MiniProfileBox />
        </nav>
    )
}

export default Navbar;
