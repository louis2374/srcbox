import { join } from '@/lib/css'
import { Tooltip } from '@mui/material'
import React, { MouseEvent, useCallback } from 'react'
import { IconType } from 'react-icons'

interface Props
{
    children?: React.ReactNode,
    Icon: IconType,
    IconSelected?: IconType,
    icon_size_override?: number,
    selected?: boolean,
    onClick?: () => void,
    tooltip: string
}

const PostCardButton: React.FC<Props> = ({ children, Icon, IconSelected, icon_size_override, selected, onClick, tooltip }) =>
{
    const click = useCallback((e: MouseEvent) =>
    {
        e.stopPropagation();
        if (onClick) onClick();
    }, [onClick])
    return (
        <Tooltip title={tooltip}>
            <button onClick={click} className={join('flex flex-row justify-center items-center gap-1 px-1 hover:text-accent active:translate-y-px', selected && "text-accent")}>
                {
                    selected && IconSelected ?
                        <IconSelected size={icon_size_override || 20} />
                        :
                        <Icon size={icon_size_override || 20} />
                }
                {children}
            </button>
        </Tooltip>
    )
}

export default PostCardButton
