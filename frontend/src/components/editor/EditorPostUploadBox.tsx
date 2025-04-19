import React, { useState } from 'react'
import SButton from '../SButton'
import { IoArrowBackOutline } from 'react-icons/io5'
import { api, useToken } from '@/lib/api/api'
import { Method } from '@srcbox/library'
import { join } from '@/lib/css'
import FormInput from '../FormInput'
import { Modal } from '@mui/material'
import { useRouter } from 'next/navigation'

interface Props
{
    open: boolean,
    set_open: (open: boolean) => void,
    content: string // String for now, may change to file upload later
}

const EditorPostUploadBox: React.FC<Props> = ({ open, set_open, content }) =>
{
    const nav = useRouter();
    const token = useToken();
    const [load_status, set_load_status] = useState("");
    const [post_title, set_post_title] = useState("");
    const [post_desc, set_post_desc] = useState("");

    const pre_upload_post = async () =>
    {
        set_load_status("Creating post...")
        try
        {
            const { post_id, upload_url } = (await api("/posts", Method.POST, { body: { title: post_title, description: post_desc }, token })).body as any
            await upload_data(upload_url)
            nav.push("/view/" + post_id)
        }
        catch (error)
        {
            set_load_status("Failed to save post")
        }
    }

    const upload_data = (p_upload_url: string) =>
    {
        set_load_status("Uploading your code...")
        return fetch(p_upload_url, { method: "PUT", body: content })
    }

    return (<>
        <Modal
            style={{
                top: '50%',
                left: '50%',
            }} open={!!load_status}><div>{load_status}</div></Modal>
        {
            open ?
                <div className='grid grid-cols-2 md:grid-cols-3'>
                    <SButton
                        className='p-2 hover:bg-neutral-800 items-center flex justify-center bg-backgrounddarker'
                        onClick={() => set_open(false)}
                    >
                        <IoArrowBackOutline size={24} />
                    </SButton>
                    <SButton
                        disabled={!post_title || !post_desc}
                        className='p-2 w-full bg-accent col-start-2 md:col-start-3 overflow-hidden disabled:text-neutral-400 disabled:bg-neutral-800'
                        onClick={pre_upload_post}
                    >
                        Commit
                    </SButton>
                </div>
                :
                <SButton
                    className='p-2 w-full bg-accent max-w-40'
                    onClick={() => set_open(true)}
                >
                    Post
                </SButton>

        }
        <div className={join('bg-backgrounddarker overflow-hidden transition-all flex flex-col gap-0', open ? "p-2 h-64 w-full" : "h-0 w-0")}>
            <FormInput
                update={(e) => set_post_title(e.target.value)}
                label='Title:'
                className='border-b-backgrounddarker focus:bg-neutral-900 p-2'
                placeholder='My Awesome Code' />
            <FormInput
                update={(e) => set_post_desc(e.target.value)}
                label='Description:'
                container_ClassName='flex-1'
                multiline
                className='flex-1 border-b-backgrounddarker focus:bg-neutral-900 p-2'
                placeholder='Super cool description ngl' />
        </div>
    </>
    )
}

export default EditorPostUploadBox;