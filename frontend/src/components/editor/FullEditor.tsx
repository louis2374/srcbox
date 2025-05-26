"use client"
import { debounce } from "@/lib/util";
import { SyntheticEvent, useCallback, useRef, useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import EditorTabBar from "@/components/editor/EditorTabBar";
import { html_convert_to_document } from "@/lib/html/document";

interface Props
{
    html?: string,
    css?: string,
    js?: string
}

const FullEditor: React.FC<Props> = ({ html, css, js }) =>
{
    const i_js = useRef(js || "");
    const i_css = useRef(css || "");
    const i_html = useRef(html || "");
    const [key, set_key] = useState(0);

    const set_js = (p_js: string) =>
    {
        console.log("UPDATE")
        i_js.current = p_js;
        reload_iframe();
    }

    const set_css = (p_css: string) =>
    {
        console.log("UPDATE")
        i_css.current = p_css;
        reload_iframe();
    }

    const set_html = (p_html: string) =>
    {
        console.log("UPDATE")
        i_html.current = p_html;
        reload_iframe();
    }

    const reload_iframe = useCallback(debounce(() =>
    {
        set_key(key + 1);
    }, 1000), [key])

    return (
        <div className="flex flex-row flex-1 w-full pt-3 box-border">
            <EditorTabBar code_content={JSON.stringify({ html: i_html, css: i_css, js: i_js })} />
            <div className="w-full flex-1 grid md:grid-cols-2 grid-rows-2 gap-2">
                <CodeEditor language="html" onChange={set_html} value={i_html.current} />
                <div className=" ">
                    <iframe
                        key={key}
                        sandbox="allow-scripts allow-forms"
                        className="w-full h-full"
                        srcDoc={html_convert_to_document(i_html.current, i_css.current, i_js.current)}
                    >
                    </iframe>
                </div>
                <CodeEditor language="javascript" onChange={set_js} value={i_js.current} />
                <CodeEditor language="css" onChange={set_css} value={i_css.current} />
            </div>
        </div>
    );
}

export default FullEditor;