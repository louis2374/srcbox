import { join } from '@/lib/css'
import React from 'react'
import FormInput from '../FormInput'

interface Props
{
    open: boolean
}

const EditorPostBox: React.FC<Props> = ({ open }) =>
{
    return (
        <div className={join('bg-backgrounddarker overflow-hidden transition-all flex flex-col gap-0', open ? "p-2 h-64 w-full" : "h-0 w-0")}>
            <FormInput
                label='Title:'
                className='border-b-backgrounddarker focus:bg-neutral-900 p-2'
                placeholder='My Awesome Code' />
            <FormInput
                label='Description:'
                container_ClassName='flex-1'
                multiline
                className='flex-1 border-b-backgrounddarker focus:bg-neutral-900 p-2'
                placeholder='Super cool description ngl' />
        </div>
    )
}

export default EditorPostBox;
