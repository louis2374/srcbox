"use client"
import { EditableCodeData } from '@srcbox/library';
import React, { SyntheticEvent } from 'react'

interface Props
{
    content: EditableCodeData
}

const PostCardContentPlayer: React.FC<Props> = ({ content }) =>
{

    // This is taken from editor, later I will consolidate
    const inject_code = (e: SyntheticEvent<HTMLIFrameElement, Event>) =>
    {
        console.log("IFRAMER ELAODED")
        const doc = e.currentTarget.contentWindow?.document;
        if (!doc) return;

        const styles = doc.createElement("style");
        styles.innerHTML = content.css || "";

        const script = doc.createElement("script");
        script.innerHTML = content.js || "";

        doc.head.appendChild(styles);
        doc.head.appendChild(script);
    }

    if (!content) return "Loading"

    return (
        <iframe className='flex-1 w-full h-full' srcDoc={content.html} onLoad={inject_code}></iframe>
    )
}

export default PostCardContentPlayer;
