"use client";
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

    const inject_code = (e: SyntheticEvent<HTMLIFrameElement, Event>) =>
    {
        const doc = e.currentTarget.contentWindow?.document;
        if (!doc) return;

        const styles = doc.createElement("style");
        styles.innerHTML = content.css || "";

        const script = doc.createElement("script");
        script.innerHTML = content.js || "";

        doc.head.appendChild(styles);
        doc.head.appendChild(script);
    };

    return (
        <div ref={main_container} className="flex-1 w-full h-full">
            {
                is_visible &&
                (content ?
                    <iframe
                        className="flex-1 w-full h-full"
                        srcDoc={content.html}
                        onLoad={inject_code}
                    />
                    :
                    "Loading")
            }
        </div>
    );
};

export default PostCardContentPlayer;