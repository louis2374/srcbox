"use client";
import { html_convert_to_document } from '@/lib/html/document';
import { EditableCodeData } from '@srcbox/library';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';

interface Props
{
    content: EditableCodeData;
}

const PostCardContentPlayer: React.FC<Props> = ({ content }) =>
{
    const main_container = useRef<HTMLDivElement>(null);
    const [is_visible, set_is_visible] = useState(false);

    useEffect(() =>
    {
        // This is a browser api that allows me to check if this component is visible
        // I dont want to render the frame if it is not
        const observer = new IntersectionObserver(
            (info) =>
            {
                set_is_visible(info[0].isIntersecting);
            },
            { threshold: 0 }
        );

        if (main_container.current) observer.observe(main_container.current);

        return () =>
        {
            if (main_container.current) observer.unobserve(main_container.current);

        };
    }, []);


    return (
        <div ref={main_container} className="flex-1 w-full h-full">
            {
                //is_visible &&
                true &&
                (content ?
                    <iframe
                        sandbox="allow-scripts allow-forms"
                        className="flex-1 w-full h-full"
                        srcDoc={html_convert_to_document(content.html || "", content.css, content.js)}
                    />
                    :
                    "Loading")
            }
        </div>
    );
};

export default PostCardContentPlayer;