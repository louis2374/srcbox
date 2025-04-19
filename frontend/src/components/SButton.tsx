"use client"
import { join } from '@/lib/css'
import React from 'react'

interface Props
{
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode,
    type?: "submit" | "reset" | "button",
    className?: string,
    disabled?: boolean
}

const SButton: React.FC<Props> = ({ disabled, onClick, children, type = "button", className }) =>
{
    return (
        <button
            disabled={disabled}
            className={join(className, "active:translate-y-px disabled:pointer-events-none")}
            onClick={onClick}
            type={type}
        >{children}</button>
    )
}

export default SButton;
