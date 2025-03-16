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

const Navbar = () =>
{
    const pn = usePathname();

    return (
        <div className='flex flex-row w-full justify-center h-[80px] sticky left-0 top-0 bg-inherit'>

            <Link
                href={"/"}
                className='hidden sm:block relative md:absolute p-4 text-3xl left-0 mr-auto md:mr-0'
            >Srcbox</Link>

            {
                // Nav buttons
                buttons.map(({ href, label, icon: Icon }) =>
                {
                    const active = pn === href;
                    return <Link
                        key={label}
                        href={href}
                        className={join('text-center w-24 py-3 px-1', active && "border-b-4 border-b-accent border-b-solid")}>
                        <Icon
                            className='m-auto'
                            size={35}
                            color={active ? "var(--accent)" : undefined} />
                        <span className={join(active && "text-accent")}>{label}</span>
                    </Link>
                })
            }

            <MiniProfileBox />
        </div>
    )
}

export default Navbar;
