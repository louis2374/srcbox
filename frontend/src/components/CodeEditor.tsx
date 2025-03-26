import { Editor, useMonaco } from '@monaco-editor/react'
import React, { useEffect, useRef } from 'react'

interface Props
{
    value?: string,
    onChange?: (value: string) => void,
    language?: "css" | "html" | "javascript"
}

const CodeEditor: React.FC<Props> = ({ value, onChange, language }) =>
{
    return (
        <Editor
            value={value}
            onChange={(e) => { if (onChange) onChange(e || "") }}
            className="font-[Menlo] text-white bg-black outline-none"
            language={language}
            theme="vs-dark"
            options={
                {
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    minimap: {
                        autohide: true,
                        renderCharacters: false,
                    }
                }
            }
        />
    )
}

export default CodeEditor
