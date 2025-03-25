"use client"
import { debounce } from "@/lib/util";
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from "@monaco-editor/react";
import CodeEditor from "@/components/CodeEditor";

export default function Home()
{

    const [i_js, i_set_js] = useState("// js");
    const [i_css, i_set_css] = useState("/* css */");
    const [i_html, i_set_html] = useState("<!-- html -->");

    // The iframe reloads if the html is updated, i dont want this
    // I want it to only reload with the deboucne function.
    // Therefore I update this only when i need to update the html
    const [iframe_html, set_iframe_html] = useState("");

    const [key, set_key] = useState(0);

    const set_js = (p_js: string) =>
    {
        console.log("UPDATE")
        i_set_js(p_js);
        reload_iframe();
    }

    const set_css = (p_css: string) =>
    {
        console.log("UPDATE")
        i_set_css(p_css);
        reload_iframe();
    }

    const set_html = (p_html: string) =>
    {
        console.log("UPDATE")
        i_set_html(p_html);
        reload_iframe();
    }

    const reload_iframe = useCallback(debounce(() =>
    {
        set_key(key + 1);
    }, 1000), [key])

    const inject_code = (e: SyntheticEvent<HTMLIFrameElement, Event>) =>
    {
        console.log("IFRAMER ELAODED")
        const doc = e.currentTarget.contentWindow?.document;
        if (!doc) return;

        const styles = doc.createElement("style");
        styles.innerHTML = i_css;

        const script = doc.createElement("script");
        script.innerHTML = i_js;

        doc.head.appendChild(styles);
        doc.head.appendChild(script);
    }

    return (
        <div className="w-full flex-1 grid md:grid-cols-2 grid-rows-2">
            <CodeEditor language="html" onChange={set_html} value={i_html} />

            <div className=" ">
                <iframe
                    key={key}
                    className="w-full h-full"
                    srcDoc={i_html}
                    onLoad={inject_code}
                >

                </iframe>
            </div>
            <CodeEditor language="javascript" onChange={set_js} value={i_js} />
            <CodeEditor language="css" onChange={set_css} value={i_css} />
        </div>

    );
}