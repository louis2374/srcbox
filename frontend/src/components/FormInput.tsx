"use client"
import { join } from '@/lib/css'
import React from 'react'

interface Props
{
    update?: React.ChangeEventHandler<HTMLInputElement>,
    type?: React.HTMLInputTypeAttribute,
    placeholder?: string,
    className?: string,
    name?: string,
    value?: string,
    status_color?: string,
    disabled?: boolean
}

// Wrapping this to have a single point to update styles
const FormInput: React.FC<Props> = ({ disabled, update, type = "text", placeholder, className, name, value, status_color }) =>
{
    return (
        <div className='flex flex-col gap-1 flex-1'>
            <input
                className={join('bg-inherit border-b-[0.15em] border-b-foreground text-inherit outline-none focus:border-b-accent', className)}
                disabled={disabled}
                type={type}
                onChange={update}
                placeholder={placeholder}
                name={name}
                value={value}
            />
            <span
                style={{ backgroundColor: status_color }}
                className={'h-[0.15em] w-8'} />
        </div>
    )
}

export default FormInput;
