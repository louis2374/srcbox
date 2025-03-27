"use client"
import { join } from '@/lib/css'
import React from 'react'

interface Props
{
    update?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    type?: React.HTMLInputTypeAttribute,
    placeholder?: string,
    className?: string,
    name?: string,
    value?: string,
    status_color?: string,
    disabled?: boolean,
    multiline?: boolean,
    container_ClassName?: string,
    label?: string,
}

// Wrapping this to have a single point to update styles
const FormInput: React.FC<Props> = ({ disabled, update, type = "text", placeholder, className, name, value, status_color, multiline, container_ClassName, label }) =>
{
    return (
        <div className={join('flex flex-col gap-1', container_ClassName)}>
            {
                label &&
                <label className='text-neutral-400 text-sm' htmlFor={name}>{label}</label>
            }

            {
                multiline ?
                    <textarea
                        className={join('bg-inherit resize-none border-b-[0.15em] border-b-foreground text-inherit outline-none focus:border-b-accent', className)}
                        disabled={disabled}
                        onChange={update}
                        placeholder={placeholder}
                        name={name}
                        value={value}
                    />
                    :
                    <input
                        className={join('bg-inherit border-b-[0.15em] border-b-foreground text-inherit outline-none focus:border-b-accent', className)}
                        disabled={disabled}
                        type={type}
                        onChange={update}
                        placeholder={placeholder}
                        name={name}
                        value={value}
                    />
            }
            <span
                style={{ backgroundColor: status_color }}
                className={'h-[0.15em] w-8'} />
        </div>
    )
}

export default FormInput;
