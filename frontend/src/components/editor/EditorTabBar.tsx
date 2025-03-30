"use client"
import React, { useState } from 'react'
import SButton from '../SButton';
import { join } from '@/lib/css';
import { MdOutlineCancel } from 'react-icons/md';
import { IoArrowBackOutline } from 'react-icons/io5';
import { api, useToken } from '@/lib/api/api';
import { Method } from '@srcbox/library';
import FormInput from '../FormInput';
import EditorPostUploadBox from './EditorPostUploadBox';

const EditorTabBar = () =>
{
    const token = useToken();
    const [post_mode, set_post_mode] = useState(false);

    return (
        <div className={join('flex flex-row transition-all', post_mode ? "w-1/4" : "w-48")}>
            <ul className='flex flex-col w-full px-4 h-full'>
                <EditorPostUploadBox open={post_mode} set_open={set_post_mode} />
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
