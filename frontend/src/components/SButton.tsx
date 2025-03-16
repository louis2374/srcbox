"use client"
import { join } from '@/lib/css'
import React from 'react'

interface Props
{
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode,
    type?: "submit" | "reset" | "button",
    className?: string
}

const SButton: React.FC<Props> = ({ onClick, children, type = "button", className }) =>
{
    return (
        <button
            className={join(className, "")}
            onClick={onClick}
            type={type}
        >{children}</button>
    )
}

export default SButton;
