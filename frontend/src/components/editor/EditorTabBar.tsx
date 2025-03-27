"use client"
import React, { useState } from 'react'
import SButton from '../SButton';
import EditorPostBox from './EditorPostBox';
import { join } from '@/lib/css';
import { MdOutlineCancel } from 'react-icons/md';
import { IoArrowBackOutline } from 'react-icons/io5';

const EditorTabBar = () =>
{
    const [post_mode, set_post_mode] = useState(false);

    return (
        <div className={join('flex flex-row transition-all w-48', post_mode && "w-1/3")}>
            <ul className='flex flex-col w-full px-4 h-full'>
                <li>
                    {
                        post_mode ?
                            <div className='grid grid-cols-2 md:grid-cols-3'>
                                <SButton
                                    className='p-2 hover:bg-neutral-800 items-center flex justify-center bg-backgrounddarker'
                                    onClick={() => set_post_mode(false)}
                                >
                                    <IoArrowBackOutline size={24} />
                                </SButton>
                                <SButton
                                    className='p-2 w-full bg-accent col-start-2 md:col-start-3'
                                >
                                    Continue
                                </SButton>
                            </div>
                            :
                            <SButton
                                className='p-2 w-full bg-accent max-w-40'
                                onClick={() => set_post_mode(!post_mode)}
                            >
                                Post
                            </SButton>

                    }
                    <EditorPostBox open={post_mode} />
                </li>
                <li>
                    <SButton
                        className='p-2 hover:bg-neutral-800 w-full text-left'
                    >
                        Load Template
                    </SButton>
                </li>
                <li>
                    <SButton
                        className='p-2 hover:bg-neutral-800 w-full text-left'
                    >
                        Save
                    </SButton>
                </li>
                <li>
                    <SButton
                        className='p-2 hover:bg-neutral-800 w-full text-left'
                    >
                        Reset
                    </SButton>
                </li>
            </ul>
        </div>
    )
}

export default EditorTabBar;
